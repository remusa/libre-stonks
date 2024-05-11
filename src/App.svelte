<script lang="ts">
  import * as apiAlphaVantage from '$lib/api/alpha-vantage'
  import * as apiIexCloud from '$lib/api/iexcloud'
  import * as apiPolygon from '$lib/api/polygon'
  import * as apiTwelveData from '$lib/api/twelve-data'
  import Clock from '$lib/components/clock.svelte'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import * as Card from '$lib/components/ui/card'
  import Combobox from '$lib/components/ui/combobox/combobox.svelte'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import * as RadioGroup from '$lib/components/ui/radio-group'
  import { Switch } from '$lib/components/ui/switch'
  import * as Tabs from '$lib/components/ui/tabs'
  import { Toggle } from '$lib/components/ui/toggle'
  import * as Tooltip from '$lib/components/ui/tooltip'
  import Small from '$lib/components/ui/typography/small.svelte'
  import * as config from '$lib/config'
  import * as dataProcessing from '$lib/data-processing'
  import * as db from '$lib/database'
  import { openConfigDir } from '$lib/file-system'
  import notify from '$lib/notifications'
  import { addToPortfolio } from '$lib/portfolio'
  import * as stockMarket from '$lib/stock-market'
  import * as stores from '$lib/stores/stores'
  import { useInterval } from '$lib/use-interval'
  import { cn } from '$lib/utils'
  import { getCurrent } from '@tauri-apps/api/window'
  import debounce from 'just-debounce-it'
  import { Eye, EyeOff } from 'lucide-svelte'
  import HeadingH3 from './lib/components/ui/typography/heading-h3.svelte'
  import mockUpdate from './mock/get-data-iex-cloud.json'
  import mockSearch from './mock/search-polygon.json'

  const appWindow = getCurrent()

  type Price = 'increment' | 'decrement' | 'no-change'

  function getChangeType(price: number): Price {
    if (price < 0) {
      return 'decrement'
    }
    if (price > 0) {
      return 'increment'
    }
    return 'no-change'
  }

  function getBadgeVariant(changeType: Price) {
    if (changeType === 'increment') {
      return 'default'
    }
    if (changeType === 'decrement') {
      return 'destructive'
    }
    return 'outline'
  }

  let portfolio = $state('main')

  let checkedAlphaVantage = $state(false)
  let checkedPolygon = $state(false)
  let checkedIexCloud = $state(false)
  let checkedTwelveData = $state(false)

  type TabsT = 'home' | 'search' | 'settings'
  let tab: TabsT = $state((localStorage.getItem('tab') as TabsT) ?? 'home')
  $effect(() => {
    localStorage.setItem('tab', tab)
    checkedAlphaVantage = checkedPolygon = checkedIexCloud = checkedTwelveData = false
  })

  let alwaysOnTop = $state(localStorage.getItem('always-on-top') === 'true' || true)
  let useNativeNotifications = $state(localStorage.getItem('use-native-notifications') === 'true' || true)
  $effect(() => {
    changeAlwaysOnTop(alwaysOnTop)
    changeNativeNotifications(useNativeNotifications)
  })
  async function changeAlwaysOnTop(value: boolean) {
    await appWindow.setAlwaysOnTop(value)
    localStorage.setItem('always-on-top', alwaysOnTop.toString())
  }
  async function changeNativeNotifications(value: boolean) {
    localStorage.setItem('use-native-notifications', useNativeNotifications.toString())
  }

  type APIEndpoint = 'alpha-vantage' | 'polygon' | 'iex-cloud' | 'twelve-data' | ''
  let apiEndpoint: APIEndpoint = $state('')
  let api = $state(apiTwelveData)

  let apiKeyAlphaVantage = $state('')
  let apiKeyPolygon = $state('')
  let apiKeyIEXCloud = $state('')
  let apiKeyTwelveData = $state('')

  $effect(() => {
    ;(async () => {
      apiKeyAlphaVantage = config.API_KEY_ALPHA_VANTAGE as string
      apiKeyPolygon = config.API_KEY_POLYGON as string
      apiKeyIEXCloud = config.API_KEY_IEX_CLOUD as string
      apiKeyTwelveData = config.API_KEY_TWELVE_DATA as string
      apiEndpoint = config.API_ENDPOINT as APIEndpoint
    })()
  })

  $effect(() => {
    stores.setValue(stores.settingsStore, 'api-key-alpha-vantage', apiKeyAlphaVantage)
    stores.setValue(stores.settingsStore, 'api-key-polygon', apiKeyPolygon)
    stores.setValue(stores.settingsStore, 'api-key-iex-cloud', apiKeyIEXCloud)
    stores.setValue(stores.settingsStore, 'api-key-twelve-data', apiKeyTwelveData)
  })

  $effect(() => {
    switch (apiEndpoint) {
      case 'alpha-vantage':
        api = apiAlphaVantage
        break
      case 'polygon':
        api = apiPolygon
        break
      case 'iex-cloud':
        api = apiIexCloud
        break
      case 'twelve-data':
        api = apiTwelveData
        break
    }
    stores.setValue(stores.settingsStore, 'api-endpoint', apiEndpoint)
  })

  const showApiKeys = {
    showAlphaVantage: false,
    showPolygon: false,
    showIEXCloud: false,
    showTwelveData: true,
  }

  const currentDate = new Date()
  const isHoliday = stockMarket.isStockMarketHoliday(currentDate)
  let isMarketOpen = $state(stockMarket.isStockMarketOpen(currentDate))

  let search = $state('')
  let searchData = $state(mockSearch.results.map(dataProcessing.formatIexCloud))

  async function pollSearch() {
    const data = await api.search(search)
    searchData = data
  }

  const onSearch = debounce(pollSearch, 3_000)

  let loading = $state(false)
  async function update() {
    loading = true
    if (isHoliday) {
      return
    }
    const data = await api.update(tickers)
    if (!isHoliday) {
      isMarketOpen = stockMarket.isStockMarketOpen(new Date())
    }
    updateData = data
    loading = false
  }

  let interval = $state(600_000)
  $effect(() => {
    useInterval(update, interval)
  })

  let tickers = db.tickers
  let updateData = $state(mockUpdate.map(dataProcessing.formatIexCloud))

  function onUpdate() {
    debounce(update, 10_000)
  }

  let selectedItem = $state({})

  export async function addTicker() {
    await addToPortfolio(selectedItem)
    selectedItem = {}
  }
</script>

<main class="flex flex-col items-center justify-start w-screen h-screen p-2 rounded-3xl shadow-3xl m-0 gap-2">
  <header>
    <!-- <HeadingH1>Libre Stonks</HeadingH1> -->
  </header>

  <Tabs.Root bind:value={tab} class="w-full h-screen">
    <Tabs.List class="grid w-full grid-cols-3">
      <Tabs.Trigger value="home">Home</Tabs.Trigger>
      <Tabs.Trigger value="search">Search</Tabs.Trigger>
      <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="home">
      <Card.Root>
        <Card.Header>
          <Card.Title>My Stonks</Card.Title>
          <Card.Description class="flex justify-between items-end w-full space-y-2">
            <span><Clock /></span>
            <span class="flex justify-end gap-2 flex-grow">
              <span>US market</span>
              <Badge variant={isMarketOpen ? 'default' : 'destructive'} class={cn(isMarketOpen && 'bg-green-500')}>
                <Small>
                  {isMarketOpen ? 'open' : 'closed'}
                </Small>
              </Badge>
            </span>
          </Card.Description>
        </Card.Header>
        <Card.Content class="space-y-2">
          <div class="w-full flex flex-col gap-2 items-center">
            <Small>Portfolio: {portfolio}</Small>

            <ul class="flex w-full flex-col gap-2 divide-y-2 divide-grey-900 divide-dashed">
              {#each updateData as item}
                {@const price = item.latestPrice}
                {@const changeType = getChangeType(price)}
                {@const badgeVariant = getBadgeVariant(changeType)}

                <li class="w-full flex justify-between pt-2">
                  <span class="col-span-7">
                    <Tooltip.Root openDelay={100}>
                      <Tooltip.Trigger>
                        <div class="pl-1">
                          <Small>
                            <div class="text-left truncate w-40">
                              {item.companyName}
                            </div>
                          </Small>
                        </div></Tooltip.Trigger>
                      <Tooltip.Content>
                        <p>{item.companyName}</p>
                      </Tooltip.Content>
                    </Tooltip.Root>
                    <Badge variant="default" class="text-blue-900 bg-blue-200">
                      <Small>
                        {item.ticker}
                      </Small>
                    </Badge>
                  </span>

                  <span class="grid grid-cols-2 gap-3 justify-center items-center">
                    <span class="text-right">{price}</span>
                    <span class="text-right">{item.change}</span>
                    <Badge variant={badgeVariant} class="flex justify-center w-16">
                      <span>
                        {#if price > 0}
                          +
                        {:else if price < 0}
                          -
                        {:else}
                          {' '}
                        {/if}
                      </span>
                      {item.changePercent}%</Badge>
                  </span>
                </li>
              {/each}
            </ul>
          </div>
        </Card.Content>
        <Card.Footer>
          <Button variant="default" on:click={onUpdate}>Update</Button>
        </Card.Footer>
      </Card.Root>
    </Tabs.Content>

    <Tabs.Content value="search">
      <Card.Root>
        <Card.Header>
          <Card.Title>Search</Card.Title>
          <Card.Description>Add stonks here.</Card.Description>
        </Card.Header>
        <Card.Content class="space-y-2">
          <div class="space-y-1">
            <Label for="search">Search</Label>
            <div class="flex justify-between gap-2">
              <Input id="search" bind:value={search} />
              <Button on:click={onSearch}>Search</Button>
            </div>
          </div>
          <div class="flex justify-between items-center gap-0">
            <Combobox data={searchData} bind:selectedItem />
            <Button on:click={addToPortfolio}>Add</Button>
          </div>
        </Card.Content>
        <Card.Footer></Card.Footer>
      </Card.Root>
    </Tabs.Content>

    <Tabs.Content value="settings">
      <Card.Root>
        <Card.Header>
          <Card.Title>Settings</Card.Title>
          <Card.Description>App settings.</Card.Description>
        </Card.Header>

        <Card.Content class="space-y-2">
          <HeadingH3 class="text-base">App</HeadingH3>

          <div class="flex items-center space-x-2">
            <Switch id="always-on-top" class="" bind:checked={alwaysOnTop} />
            <Label for="always-on-top">Always on top</Label>
          </div>

          <div class="flex items-center space-x-2">
            <Switch id="native-notifications" class="" bind:checked={useNativeNotifications} disabled />
            <Label for="native-notifications">Use native notifications</Label>
          </div>

          <HeadingH3 class="text-base pt-2">API Keys</HeadingH3>

          <div class="space-y-1">
            <RadioGroup.Root bind:value={apiEndpoint}>
              {#if showApiKeys.showAlphaVantage}
                <div class="flex items-center space-x-2">
                  <RadioGroup.Item value="alpha-vantage" id="r1" disabled />
                  <Label for="r1">Alpha Vantage</Label>
                </div>
              {/if}
              {#if showApiKeys.showPolygon}
                <div class="flex items-center space-x-2">
                  <RadioGroup.Item value="polygon" id="r2" />
                  <Label for="r2">Polygon</Label>
                </div>
              {/if}
              {#if showApiKeys.showIEXCloud}
                <div class="flex items-center space-x-2">
                  <RadioGroup.Item value="iex-cloud" id="r3" />
                  <Label for="r3">IEX Cloud</Label>
                </div>
              {/if}
              {#if showApiKeys.showTwelveData}
                <div class="flex items-center space-x-2">
                  <RadioGroup.Item value="twelve-data" id="r3" />
                  <Label for="r3">Twelve Data</Label>
                </div>
              {/if}
              <RadioGroup.Input name="spacing" />
            </RadioGroup.Root>
          </div>

          <div class="space-y-1">
            {#if showApiKeys.showAlphaVantage}
              <div class="space-y-1">
                <Label for="api-key-alpha-vantage">Alpha Vantage</Label>
                <div class="relative w-full">
                  {#if checkedAlphaVantage}
                    <Input
                      id="api-key-alpha-vantage"
                      bind:value={apiKeyAlphaVantage}
                      disabled={apiEndpoint !== 'alpha-vantage'} />
                  {:else}
                    <Input
                      id="api-key-alpha-vantage"
                      bind:value={apiKeyAlphaVantage}
                      type="password"
                      checked={checkedAlphaVantage}
                      disabled={apiEndpoint !== 'alpha-vantage'} />
                  {/if}
                  <Toggle
                    class="absolute inset-y-0 top-[2px] right-0 mr-1 flex items-center cursor-pointer"
                    disabled={!apiKeyAlphaVantage || apiEndpoint !== 'alpha-vantage'}
                    size="sm"
                    variant="default"
                    bind:pressed={checkedAlphaVantage}
                    aria-label="toggle bold">
                    {#if checkedAlphaVantage}
                      <EyeOff class="h-4 w-4" />
                    {:else}
                      <Eye class="h-4 w-4" />
                    {/if}
                  </Toggle>
                </div>
              </div>
            {/if}

            {#if showApiKeys.showPolygon}
              <div class="space-y-1">
                <Label for="api-key-polygon">Polygon</Label>
                <div class="relative w-full">
                  {#if checkedPolygon}
                    <Input id="api-key-polygon" bind:value={apiKeyPolygon} disabled={apiEndpoint !== 'polygon'} />
                  {:else}
                    <Input
                      id="api-key-polygon"
                      bind:value={apiKeyPolygon}
                      disabled={apiEndpoint !== 'polygon'}
                      type="password"
                      checked={checkedPolygon} />
                  {/if}
                  <Toggle
                    class="absolute inset-y-0 top-[2px] right-0 mr-1 flex items-center cursor-pointer"
                    disabled={!apiKeyPolygon || apiEndpoint !== 'polygon'}
                    size="sm"
                    variant="default"
                    bind:pressed={checkedPolygon}
                    aria-label="toggle bold">
                    {#if checkedPolygon}
                      <EyeOff class="h-4 w-4" />
                    {:else}
                      <Eye class="h-4 w-4" />
                    {/if}
                  </Toggle>
                </div>
              </div>
            {/if}

            {#if showApiKeys.showIEXCloud}
              <div class="space-y-1">
                <Label for="api-key-iex-cloud">IEX Cloud</Label>
                <div class="relative w-full">
                  {#if checkedIexCloud}
                    <Input id="api-key-iex-cloud" bind:value={apiKeyIEXCloud} disabled={apiEndpoint !== 'iex-cloud'} />
                  {:else}
                    <Input
                      id="api-key-iex-cloud"
                      bind:value={apiKeyIEXCloud}
                      disabled={apiEndpoint !== 'iex-cloud'}
                      type="password"
                      checked={checkedIexCloud} />
                  {/if}
                  <Toggle
                    class="absolute inset-y-0 top-[2px] right-0 mr-1 flex items-center cursor-pointer"
                    disabled={!apiKeyIEXCloud || apiEndpoint !== 'iex-cloud'}
                    size="sm"
                    variant="default"
                    bind:pressed={checkedIexCloud}
                    aria-label="toggle bold">
                    {#if checkedIexCloud}
                      <EyeOff class="h-4 w-4" />
                    {:else}
                      <Eye class="h-4 w-4" />
                    {/if}
                  </Toggle>
                </div>
              </div>
            {/if}

            {#if showApiKeys.showTwelveData}
              <div class="space-y-1">
                <Label for="api-key-twelve-data">Twelve Data</Label>
                <div class="relative w-full">
                  {#if checkedTwelveData}
                    <Input
                      id="api-key-twelve-data"
                      bind:value={apiKeyTwelveData}
                      disabled={apiEndpoint !== 'twelve-data'} />
                  {:else}
                    <Input
                      id="api-key-twelve-data"
                      bind:value={apiKeyTwelveData}
                      disabled={apiEndpoint !== 'twelve-data'}
                      type="password"
                      checked={checkedTwelveData} />
                  {/if}
                  <Toggle
                    class="absolute inset-y-0 top-[2px] right-0 mr-1 flex items-center cursor-pointer"
                    disabled={!apiKeyTwelveData || apiEndpoint !== 'twelve-data'}
                    size="sm"
                    variant="default"
                    bind:pressed={checkedTwelveData}
                    aria-label="toggle bold">
                    {#if checkedTwelveData}
                      <EyeOff class="h-4 w-4" />
                    {:else}
                      <Eye class="h-4 w-4" />
                    {/if}
                  </Toggle>
                </div>
              </div>
            {/if}
          </div>
        </Card.Content>

        <Card.Footer>
          <div class="flex items-center justify-center space-x-2">
            <Button variant="outline" on:click={openConfigDir}>Config</Button>
            <Button variant="outline" on:click={() => notify('Notification', 'Test notification')}
              >Send test notification</Button>
          </div>
        </Card.Footer>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>

  <footer>
    <Small>Libre Stonks</Small>
  </footer>
</main>

<style>
</style>
