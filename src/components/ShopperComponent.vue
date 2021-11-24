<template>
  <div class="shopper">
      <div class="shopper-name" @click="openWindow">
          {{ shopper.name }}
      </div>
      <div class="modal-mask" v-if="showDataWindow">
          <div class="modal-wrapper" v-click-away="onClickAway">
            <div class="modal-container">
                <h2>Shopper Data:</h2>
              <div class="header-text">
                Name: {{ shopper.name }}
                <br>
                <br>
                Cart items:
                <div class="cart-list">
                    
                    <div v-for="(item, index) in shopper.cart" :key="index">
                        {{ item.name }} ( ${{ item.price }} )
                    </div>
                </div>
                <br>
                Cart value: ${{ shopper.cartValue }}
              </div>
              <div class="close-button" @click="onClickAway">
                Close
              </div>
            </div>
          </div>
        </div>
  </div>
</template>

<script>
import VueClickAway from 'vue3-click-away';

export default {
    name: 'ShopperComponent',
    props: {
        shopper: Object,
    },
    directives: {
        vClickAway: VueClickAway,
    },
    data() {
        return {
            showDataWindow: false,
        };
    },
    methods: {
        onClickAway() {
            this.showDataWindow = false;
            this.$emit('resume');
        },
        openWindow() {
            this.showDataWindow = true;
            this.$emit('pause');
        }
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
.shopper-name {
    border: 1px solid black;
    margin: 1px;
}
.close-button {
  background: #f1f1f1;
  padding: 16px;
  padding-left: 24px;
  padding-right: 24px;
  border-radius: 30px;
  cursor: pointer;
}
.close-button:hover {
  background: #cccccc;
}
</style>