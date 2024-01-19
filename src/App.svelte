<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import * as Card from '$lib/components/ui/card'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import * as Tabs from '$lib/components/ui/tabs'
  import { cn } from '$lib/utils'
  import dayjs from 'dayjs'
  import HeadingH1 from './lib/components/ui/typography/heading-h1.svelte'

  let stocks = [
    {
      name: 'Google',
      ticker: 'GOOG',
      price: 17.55,
      date: dayjs(),
    },
    {
      name: 'Apple',
      ticker: 'APPL',
      price: -69.99,
      date: dayjs(),
    },
  ]
  let search = ''
  console.log(`🚀 ~ search:`, search)
</script>

<main class="flex flex-col items-center justify-start w-screen h-screen p-4 rounded-3xl shadow-3xl m-0">
  <header>
    <HeadingH1>Stock tracker</HeadingH1>
  </header>

  <Tabs.Root value="home" class="w-full">
    <Tabs.List class="grid w-full grid-cols-3">
      <Tabs.Trigger value="home">Home</Tabs.Trigger>
      <Tabs.Trigger value="search">Search</Tabs.Trigger>
      <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="home">
      <Card.Root>
        <Card.Header>
          <Card.Title>Home</Card.Title>
          <Card.Description>Portfolio.</Card.Description>
        </Card.Header>
        <Card.Content class="space-y-2">
          <div class="w-full flex flex-col gap-2 items-center">
            <ul class="flex w-full flex-col gap-2 divide-y-2 divide-grey-900 divide-dashed">
              {#each stocks as item, i (item.ticker)}
                {@const noChange = item.price === 0}
                {@const increment = item.price > 0}
                {@const decrement = item.price < 0}
                <li class="grid-cols-12 w-full grid pt-2">
                  <span class="col-span-7">
                    <div>
                      <span class="p-1 rounded bold text-blue-900 bg-blue-200 w-16">
                        {item.ticker}
                      </span>
                    </div>
                    <div>
                      <span class="bold">
                        {item.name}
                      </span>
                    </div>
                  </span>
                  <span class="col-span-5 grid grid-cols-2 gap-3 justify-center items-center">
                    <span class="text-right">{item.price}</span>
                    <span
                      class={cn(
                        'rounded p-1 text-white flex justify-between gap-0 bold',
                        increment && 'bg-green-500',
                        decrement && 'bg-red-500',
                        noChange && 'bg-grey-500',
                      )}
                    >
                      <span>
                        {#if increment}
                          +
                        {:else if decrement}
                          -
                        {:else}
                          ' '
                        {/if}
                      </span>
                      <span>
                        {Math.abs(item.price)}
                      </span>
                      <span>%</span>
                    </span>
                  </span>
                </li>
              {/each}
            </ul>
          </div>
        </Card.Content>
        <Card.Footer></Card.Footer>
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
            <Input id="search" value="search" />
          </div>
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
        <Card.Content class="space-y-2"></Card.Content>
        <Card.Footer></Card.Footer>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>
</main>

<style>
</style>
