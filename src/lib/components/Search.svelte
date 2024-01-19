<script lang="ts">
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'

</script>

<div>
  <div class="flex flex-col w-full max-w-sm gap-1.5">
    <Label for="search">Search</Label>
    <Input type="text" id="search" placeholder="Add ticker..." />
  </div>
</div>
