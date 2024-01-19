<script lang="ts">
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import * as Card from '$lib/components/ui/card'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import { Switch } from '$lib/components/ui/switch'
  import * as Tabs from '$lib/components/ui/tabs'
  import Paragraph from '$lib/components/ui/typography/paragraph.svelte'
  import { getCurrent } from '@tauri-apps/api/window'
  import { onMount } from 'svelte'
  import HeadingH1 from './lib/components/ui/typography/heading-h1.svelte'
  import Small from './lib/components/ui/typography/small.svelte'
  import { getValue, setValue, store } from './stores/stores'

  const appWindow = getCurrent()

  type Price = 'increment' | 'decrement' | 'meh'

  function getChangeType(price: number): Price {
    if (price < 0) {
      return 'decrement'
    } else if (price > 0) {
      return 'increment'
    } else {
      return 'meh'
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

  type Stock = {
    name: string
    ticker: string
    price: number[]
  }

  let stocks: Stock[] = [
    {
      name: 'Google',
      ticker: 'GOOG',
      price: [17.55, 50.0],
    },
    {
      name: 'Apple',
      ticker: 'APPL',
      price: [-100, -69.99],
    },
    {
      name: 'Meta',
      ticker: 'META',
      price: [0, 0],
    },
  ]
  let search = ''

  type Tabs = 'home' | 'search' | 'settings'
  let tab: Tabs = (localStorage.getItem('tab') as Tabs) ?? 'home'
  $: {
    localStorage.setItem('tab', tab)
  }

  let alwaysOnTop = localStorage.getItem('always-on-top') === 'true' ?? true
  $: {
    changeAlwaysOnTop(alwaysOnTop)
  }

  async function changeAlwaysOnTop(value: boolean) {
    await appWindow.setAlwaysOnTop(value)
    localStorage.setItem('always-on-top', alwaysOnTop.toString())
  }

  let apiKey: string
  $: {
    setValue(store, 'api-key', apiKey)
  }
  onMount(async () => {
    apiKey = (await getValue(store, 'api-key')) as string
  })

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
              {#each stocks as item (item.ticker)}
                {@const price = item.price.at(0) + item.price.at(-1)}
                {@const changeType = getChangeType(price)}
                {@const badgeVariant = getBadgeVariant(changeType)}

                <li class="w-full flex justify-between pt-2">
                  <span class="col-span-7">
                    <Badge variant="default" class="text-blue-900 bg-blue-200">
                      <Small>
                        {item.ticker}
                      </Small>
                    </Badge>
                    <div class="pl-2">
                      <Small>
                        {item.name}
                      </Small>
                    </div>
                  </span>

                  <span class="grid grid-cols-2 gap-3 justify-center items-center">
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
                        {Math.abs(item.price.at(-1))}
                      </span>
                      <span>%</span></Badge
                    >
                    <!-- <span
                      class={cn(
                        'rounded p-1 text-white flex justify-between gap-0 bold',
                        changeType === 'increment' && 'bg-green-500',
                        changeType === 'decrement' && 'bg-red-500',
                        changeType === 'meh' && 'bg-grey-500',
                      )}
                    >
                    </span> -->
                  </span>
                </li>
              {/each}
            </ul>
          </div>
        </Card.Content>
        <Card.Footer>
          <Button
            variant="default"
            on:click={function () {
              console.log('updating')
            }}>Update</Button
          >
        </Card.Footer>
      </Card.Root>
    </Tabs.Content>

    <Tabs.Content value="search">
      <Card.Root>
        <Card.Header>
          <Card.Title>Search</Card.Title>
          <Card.Description>Add stonks here. Click save when you're done.</Card.Description>
        </Card.Header>
        <Card.Content class="space-y-2">
          <div class="space-y-1">
            <Label for="search">Search</Label>
            <Input id="search" bind:value={search} />
          </div>
          <Paragraph>{search}</Paragraph>
        </Card.Content>
        <Card.Footer>
          <Button>Search</Button>
        </Card.Footer>
      </Card.Root>
    </Tabs.Content>

    <Tabs.Content value="settings">
      <Card.Root>
        <Card.Header>
          <Card.Title>Settings</Card.Title>
          <Card.Description>App settings.</Card.Description>
        </Card.Header>
        <Card.Content class="space-y-2">
          <div class="flex items-center space-x-2">
            <Switch id="always-on-top" class="" bind:checked={alwaysOnTop} />
            <Label for="always-on-top">Always on top</Label>
          </div>
          <div class="space-y-1">
            <Label for="api-key">API key</Label>
            <Input id="api-key" bind:value={apiKey} />
          </div>
        </Card.Content>
        <Card.Footer></Card.Footer>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>
</main>

<style>
</style>
