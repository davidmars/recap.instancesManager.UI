<!-- un simple div avec une loading dedans-->
<template>
  <div class="fill-height d-flex justify-center align-center "
      style="
                position:absolute;
                width: 100%;
                background-color: rgba(0,0,0,0.5);
                z-index: 1;
              ">
    <v-progress-circular indeterminate size="100" />
  </div>
</template>

<script>
export default {
  name: "loading-layer"
}
</script>