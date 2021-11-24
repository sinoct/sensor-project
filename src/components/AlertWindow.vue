<template>
  <div>
      <div class="modal-mask">
          <div class="modal-wrapper" v-click-away="onClickAway">
            <div class="modal-container">
              <div class="header-text">
                  Theft detected!
                  <br>
                  {{ shopper.name }} did not pay before leaving the shop!
                  <br>
                  Value stolen: {{ shopper.cartValue}}$
              </div>
              <div class="confirm-button" @click="onClickAway">
                Ok
              </div>
            </div>
          </div>
        </div>
  </div>
</template>

<script>
import VueClickAway from 'vue3-click-away';

export default {
    name: "AlertWindow",
    props: {
        title: String,
        shopper: Object,
    },
    directives: {
      vClickAway: VueClickAway,
    },
    methods: {
      onClickAway() {
        this.$emit('clickedAway');
      },
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

.modal-container {
  // width: 300px;
  // margin: 0px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: auto;
  max-width: 600px;
  margin-left: 3rem;
  margin-right: 3rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  z-index: 9999;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.confirm-button {
  background: #f1f1f1;
  padding: 16px;
  padding-left: 24px;
  padding-right: 24px;
  border-radius: 30px;
  cursor: pointer;
}
.confirm-button:hover {
  background: #cccccc;
}
.header-text {
  padding: 10px;
}
</style>