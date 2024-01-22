<script lang="ts">
  import * as apiAlphaVantage from '$lib/api/alpha-vantage'
  import * as apiPolygon from '$lib/api/polygon'
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
  import HeadingH1 from '$lib/components/ui/typography/heading-h1.svelte'
  import Small from '$lib/components/ui/typography/small.svelte'
  import * as config from '$lib/config'
  import * as dataProcessing from '$lib/data-processing'
  import * as db from '$lib/database'
  import { openConfigDir } from '$lib/file-system'
  import notify from '$lib/notifications'
  import { addToPortfolio } from '$lib/portfolio'
  import * as stores from '$lib/stores/stores'
  import { getCurrent } from '@tauri-apps/api/window'
  import debounce from 'just-debounce-it'
  import { Eye, EyeOff } from 'lucide-svelte'
  import { onMount } from 'svelte'
  import HeadingH3 from './lib/components/ui/typography/heading-h3.svelte'
  import mockSearch from './mock/search-polygon.json'

  const appWindow = getCurrent()

  type Price = 'increment' | 'decrement' | 'no-change'

  function getChangeType(price: number): Price {
    if (price < 0) {
      return 'decrement'
    } else if (price > 0) {
      return 'increment'
    } else {
      return 'no-change'
    }
  }

  function getBadgeVariant(changeType: Price) {
    if (changeType === 'increment') {
      return 'default'
    } else if (changeType === 'decrement') {
      return 'destructive'
    } else {
      return 'outline'
    }
  }

  type Tabs = 'home' | 'search' | 'settings'
  let tab: Tabs = (localStorage.getItem('tab') as Tabs) ?? 'home'
  $: {
    localStorage.setItem('tab', tab)
    checkedAlphaVantage = checkedPolygon = false
  }

  let alwaysOnTop = localStorage.getItem('always-on-top') === 'true' || true
  let useNativeNotifications = localStorage.getItem('use-native-notifications') === 'true' || true
  $: {
    changeAlwaysOnTop(alwaysOnTop)
    changeNativeNotifications(useNativeNotifications)
  }
  async function changeAlwaysOnTop(value: boolean) {
    await appWindow.setAlwaysOnTop(value)
    localStorage.setItem('always-on-top', alwaysOnTop.toString())
  }
  async function changeNativeNotifications(value: boolean) {
    localStorage.setItem('use-native-notifications', useNativeNotifications.toString())
  }

  let apiKeyAlphaVantage: string
  let apiKeyPolygon: string
  onMount(async () => {
    apiKeyAlphaVantage = config.API_KEY_ALPHA_VANTAGE as string
    apiKeyPolygon = config.API_KEY_POLYGON as string
  })
  $: {
    stores.setValue(stores.settingsStore, 'api-key-alpha-vantage', apiKeyAlphaVantage)
    stores.setValue(stores.settingsStore, 'api-key-polygon', apiKeyPolygon)
  }

  type APIEndpoint = 'alpha-vantage' | 'polygon'
  let apiEndpoint: APIEndpoint = 'polygon'
  let api = apiPolygon
  $: {
    switch (apiEndpoint) {
      case 'alpha-vantage':
        api = apiAlphaVantage
        break
      case 'polygon':
        api = apiPolygon
        break
    }
  }

  let search = ''
  let searchData = mockSearch.results.map(dataProcessing.formatPolygon)
  const onSearch = debounce(async () => {
    const data = await api.search(search)
    const processed = data.map(dataProcessing.formatPolygon)
    searchData = processed
  }, 3000)

  let tickers = db.tickers
  const onUpdate = debounce(async () => {
    const data = await api.update(tickers)
  })

  let selectedItem = {}
  export async function addTicker() {
    await addToPortfolio(selectedItem)
    selectedItem = {}
  }

  let checkedAlphaVantage = false
  let checkedPolygon = false
</script>

<main class="flex flex-col items-center justify-start w-screen h-screen p-4 rounded-3xl shadow-3xl m-0 gap-2">
  <header>
    <HeadingH1>Stonks</HeadingH1>
  </header>

  <Tabs.Root bind:value={tab} class="w-full h-full">
    <Tabs.List class="grid w-full grid-cols-3">
      <Tabs.Trigger value="home">Home</Tabs.Trigger>
      <Tabs.Trigger value="search">Search</Tabs.Trigger>
      <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="home">
      <Card.Root>
        <Card.Header>
          <Card.Title>My Stonks</Card.Title>
          <Card.Description>Default Portfolio.</Card.Description>
        </Card.Header>
        <Card.Content class="space-y-2">
          <div class="w-full flex flex-col gap-2 items-center">
            <ul class="flex w-full flex-col gap-2 divide-y-2 divide-grey-900 divide-dashed">
              {#each tickers as item (item.ticker_name)}
                <!-- {@const price = (item.price?.at(0) ?? 0) + (item.price?.at(-1) ?? 0)} -->
                <!-- {@const changeType = getChangeType(price)} -->
                <!-- {@const badgeVariant = getBadgeVariant(changeType)} -->

                <li class="w-full flex justify-between pt-2">
                  <span class="col-span-7">
                    <Badge variant="default" class="text-blue-900 bg-blue-200">
                      <Small>
                        {item.ticker_name}
                      </Small>
                    </Badge>
                    <div class="pl-2">
                      <Small>
                        {item.ticker_long_name}
                      </Small>
                    </div>
                  </span>

                  <!-- <span class="grid grid-cols-2 gap-3 justify-center items-center">
                    <span class="text-right">{item.price.at(-1)}</span>
                    <Badge variant={badgeVariant} class="flex justify-between w-16">
                      <span>
                        {#if changeType === 'increment'}
                          +
                        {:else if changeType === 'decrement'}
                          -
                        {:else}
                          {' '}
                        {/if}
                      </span>
                      <span>
                        {Math.abs(item.price?.at(-1) ?? 0)}
                      </span>
                      <span>%</span></Badge
                    >
                    <span
                      class={cn(
                        'rounded p-1 text-white flex justify-between gap-0 bold',
                        changeType === 'increment' && 'bg-green-500',
                        changeType === 'decrement' && 'bg-red-500',
                        changeType === 'no-change' && 'bg-grey-500',
                      )}
                    >
                    </span>
                  </span> -->
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
              <div class="flex items-center space-x-2">
                <RadioGroup.Item value="alpha-vantage" id="r1" disabled />
                <Label for="r1">Alpha Vantage</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroup.Item value="polygon" id="r2" />
                <Label for="r2">Polygon</Label>
              </div>
              <RadioGroup.Input name="spacing" />
            </RadioGroup.Root>
          </div>

          <div class="space-y-1">
            <Label for="api-key-alpha-vantage">Alpha Vantage</Label>
            <div class="relative w-full">
              {#if checkedAlphaVantage}
                <Input
                  id="api-key-alpha-vantage"
                  bind:value={apiKeyAlphaVantage}
                  disabled={apiEndpoint !== 'alpha-vantage'}
                />
              {:else}
                <Input
                  id="api-key-alpha-vantage"
                  bind:value={apiKeyAlphaVantage}
                  type="password"
                  checked={checkedAlphaVantage}
                  disabled={apiEndpoint !== 'alpha-vantage'}
                />
              {/if}
              <Toggle
                class="absolute inset-y-0 top-[2px] right-0 mr-1 flex items-center cursor-pointer"
                disabled={!apiKeyAlphaVantage || apiEndpoint !== 'alpha-vantage'}
                size="sm"
                variant="default"
                bind:pressed={checkedAlphaVantage}
                aria-label="toggle bold"
              >
                {#if checkedAlphaVantage}
                  <EyeOff class="h-4 w-4" />
                {:else}
                  <Eye class="h-4 w-4" />
                {/if}
              </Toggle>
            </div>

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
                    checked={checkedPolygon}
                  />
                {/if}
                <Toggle
                  class="absolute inset-y-0 top-[2px] right-0 mr-1 flex items-center cursor-pointer"
                  disabled={!apiKeyPolygon || apiEndpoint !== 'polygon'}
                  size="sm"
                  variant="default"
                  bind:pressed={checkedPolygon}
                  aria-label="toggle bold"
                >
                  {#if checkedPolygon}
                    <EyeOff class="h-4 w-4" />
                  {:else}
                    <Eye class="h-4 w-4" />
                  {/if}
                </Toggle>
              </div>
            </div>
          </div>
        </Card.Content>
        <Card.Footer>
          <div class="flex items-center justify-center space-x-2">
            <Button variant="outline" on:click={openConfigDir}>Config</Button>
            <Button variant="outline" on:click={() => notify('Notification', 'Test notification')}
              >Send test notification</Button
            >
          </div>
        </Card.Footer>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>
</main>

<style>
</style>
