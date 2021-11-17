<template>
  <div>
      <div class="modal-mask">
          <div class="modal-wrapper" v-click-away="onClickAway">
            <div class="modal-container">
              <div class="header-text">
                  Theft detected!
              </div>
            </div>
          </div>
        </div>
  </div>
</template>

<script>
export default {
    name: "AlertWindow",
    prop: {
        title: String,
        shopper: Object,
    }
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
  align-items: center;
  align-self: center;
  justify-content: center;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>