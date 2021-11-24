<template>
  <div class="main-screen">
    <div class="grid-container">
      <div class="mask" :class="{ isActive: isMaskRequired  }">
        <img class="mask" src="@/assets/mask.png" />
      </div>
      <div class="title">
        <h1>Security System</h1>
      <div class="start-button" :class="{ started: isStarted, stopped: !isStarted }" @click="isStarted = !isStarted">
        {{ startText }}
      </div>
      <div class="label-divider"></div>
      <label for="maskLimit"> Mask limit: (0-30) </label>
      <input class="input" type="number" id="maskLimit" min="0" max="30" v-model="maskLimit">
      <label for="storeLimit"> Store limit: (0-30) </label>
      <input class="input" type="number" id="storeLimit" min="1" max="30" v-model="storeLimit">
      <button class="reset-button" @click="reset">reset</button>
      <alert-window v-if="showAlertWindow" @clickedAway="showAlertWindow = false" :shopper="thief"></alert-window>
      </div>
      <div class="door">
        <div class="shopperList">
        {{ personCount }} Shoppers:
        <div class="shopper-list">
        <shopper-component v-for="shopper in shoppers" :key="shopper.id" :shopper="shopper" @pause="this.isStarted = false" @resume="this.isStarted = true"/>
        </div>
        <!-- <div class="shopper-list" ref="shoppers">
          {{ shopperList }}
        </div> -->
      </div>
      </div>
    </div>
      <div class="content-wrapper row">
        <div class="map-wrapper">
          <div class="map-entrance zone">
            <div class="zone-text">
            Entrance
            <br>
            Shoppers: {{ zones[0].shopperCounter }}
            </div>
            <img class="image" v-if="!isDoorLocked" src="@/assets/door-open.png">
            <img class="image" v-else src="@/assets/door-closed.png">
            <motion-sensor :zoneNumber="0" @shopperMovement="movementDetected" />
            <checkout-sensor @checkedOut="checkoutDetected"></checkout-sensor>
          </div>
          <div class="map-zone-1 zone">
            <div class="zone-text">
            Food
            <br>
            Shoppers: {{ zones[1].shopperCounter }}
            </div>
            <img class="image"  src="@/assets/food.png">
            <motion-sensor :zoneNumber="1" @shopperMovement="movementDetected" @cartEvent="purchaseDetected" />
          </div>
          <div class="map-zone-2 zone">
            <div class="zone-text">
            Clothes
            <br>
            Shoppers: {{ zones[2].shopperCounter }}
            </div>
            <img class="image"  src="@/assets/t-shirt.png">
            <motion-sensor :zoneNumber="2" @shopperMovement="movementDetected" @cartEvent="purchaseDetected" />
          </div>
          <div class="map-zone-3 zone">
            <div class="zone-text">
            Gardening
            <br>
            Shoppers: {{ zones[3].shopperCounter }}
            </div>
            <img class="image"  src="@/assets/garden.png">
            <motion-sensor :zoneNumber="3" @shopperMovement="movementDetected" @cartEvent="purchaseDetected" />
          </div>
          <div class="map-zone-4 zone">
            <div class="zone-text">
            Electronics
            <br>
            Shoppers: {{ zones[4].shopperCounter }}
            </div>
            <img class="image"  src="@/assets/electronics.png">
            <motion-sensor :zoneNumber="4" @shopperMovement="movementDetected" @cartEvent="purchaseDetected" />
          </div>
        </div>
        <div class="logs">
        Logs:
        <div class="log-table" ref="logging">
          {{ logs }}
        </div>
      </div>
      </div>
  </div>
</template>

<script>
import MotionSensor from '@/components/MotionSensor.vue';
import AlertWindow from '@/components/AlertWindow.vue';
import CheckoutSensor from '@/components/CheckoutSensor.vue';
import ShopperComponent from '@/components/ShopperComponent.vue';

export default {
    name: 'MainSceen',
    components: {
      MotionSensor,
      AlertWindow,
      CheckoutSensor,
      ShopperComponent,
    },
    data() {
      return {
        names: [ 'Noah', 'John','Andrew', 'Rick Astley', 'Oliver', 'Henry', 'Alexander', 'Mason', 'Ethan', 'Daniel', 'Shrek', 'Jacob', 'Logan','Keanu Reeves' ,'Sebastian', 'Danny DeVito','Owen', 'Theodore', 'Samuel', 'Charlotte', 'Isabella', 'Hannah', 'Zoe', 'Stella', 'Lucy','William', 'Danny DeVito', 'Emma' ,'Silvester Stallone', 'Emma' ],
        logs: '',
        thief: {},
        shoppers: [],
        isStarted: false,
        showAlertWindow: false,
        maskLimit: 5,
        storeLimit: 10,
        personIndex: 0,
        shopperList: '',
        zones: [
          { name: 'Entrance', index: 0, neighbors: [1, 2], shopperCounter: 0 },
          { name: 'Food', index: 1, neighbors: [0, 2, 3], shopperCounter: 0, items: [ { name: 'Pizza', price: 2 }, { name: 'Chicken', price: 4 } , { name: 'Bread', price: 3} ] },
          { name: 'Clothes', index: 2, neighbors: [0, 1, 4], shopperCounter: 0, items: [ { name: 'Jacket', price: 30 }, { name: 'Shirt', price: 10 }, { name: 'Shoes', price: 20 } ] },
          { name: 'Gardening', index: 3, neighbors: [1, 4], shopperCounter: 0, items: [ { name: 'Shovel', price: 15 }, { name: 'Flowers', price: 3 }, { name: 'Hose', price: 5 } ] },
          { name: 'Electronics', index: 4, neighbors: [2, 3], shopperCounter: 0, items: [ { name: 'Headphones', price: 50 }, { name: 'Laptop', price: 999 }, { name: 'Smnartphone', price: 499 }] }],
      };
    },
    methods: {
      doRandomStuff() {
        if (this.isStarted && !this.showAlertWindow) {
          this.shoppers.forEach( (shopper) => {
            if (shopper.isFinished) {
              this.checkout(shopper);
              this.removePerson(shopper);
            } else {
              this.personAction(shopper);
            }
          })
          if (!this.isDoorLocked) {
            this.addPerson();
          }
          this.updateShoppers();
        }
      },
      addPerson() {
        if (Math.random() > 0.5) {
          let index = Math.floor(Math.random() * (this.names.length - 1));
          let name = this.names[index];
          this.names.splice(index, 1);
          this.shoppers.push({ id: this.personIndex, name, location: this.zones[0], cart: [], isFinished: false, cartValue: 0 });
          this.zones[0].shopperCounter++;
          this.personIndex += 1;
          this.logs = `${this.logs}\n${name} entered the shop.`;
        }
      },
      removePerson(shopper) {
        console.log('EXIT', shopper.name);
        this.names.push(shopper.name);
        this.zones[0].shopperCounter--;
        let index = this.shoppers.findIndex((x) => x.name === shopper.name);
        this.shoppers.splice(index, 1);
        this.logs = `${this.logs}\n${shopper.name} left the store.`;
        this.scrollToBottom();
      },
      personAction(shopper) {
        // console.log('SHOPPER', shopper, 'INDEX', shopperIndex); 
        // buy item
        if (Math.random() > 0.7 && shopper.location.index !== 0) {
          let itemNumber = Math.floor(Math.random() * shopper.location.items.length);
          console.log(itemNumber);
          let item = shopper.location.items[itemNumber];
          shopper.cart.push(item);
          shopper.cartValue += item.price;
          this.eventBus.emit(`purchaseEvent-${shopper.location.index}`, { shopper, item: item.name });
        }
        // movement
        let random = Math.floor(Math.random() * (shopper.location.neighbors.length))
        let newLocation = shopper.location.neighbors[random];
        if (newLocation === 0) {
          shopper.isFinished = true;
        }
        this.zones[shopper.location.index].shopperCounter--;
        this.zones[newLocation].shopperCounter++;
        shopper.location = this.zones[newLocation];
        this.eventBus.emit(`movement-zone-${newLocation}`, shopper )
      },
      movementDetected(params) {
        this.logs = `${this.logs}\n${params.person} moved to the ${this.zones[params.location].name} aisle.`;
        this.scrollToBottom();
      },
      purchaseDetected(params) {
        this.logs = `${this.logs}\n${params.shopper.name} bought ${params.item}`;
        this.scrollToBottom();
      },
      checkoutDetected(params) {
        this.logs= `${this.logs}\n${params.name} payed ${params.cartValue}$`;
      },
      scrollToBottom() {
        /* let div = this.$refs.logging;
        div.scrollTop = div.scrollHeight;*/
      },
      showAlert(shopper) {
        this.thief = shopper;
        this.showAlertWindow = true;
      },
      updateShoppers() {
        this.shopperList = '';
        for (const shopper of this.shoppers){
          this.shopperList = `${this.shopperList}\n${shopper.name}`;
        }
      },
      checkout(shopper) {
        // true if the shopper payed
        if (shopper.cart.length > 0) {
          let result = Math.random() > 0.05 ? true: false;
          if (!result) {
            this.showAlert(shopper);
          } else {
            this.eventBus.emit('checkout-event', shopper)
          }
        }
      },
      reset() {
        this.names = [ 'Noah', 'John','Andrew', 'Rick Astley', 'Oliver', 'Henry', 'Alexander', 'Mason', 'Ethan', 'Daniel', 'Shrek', 'Jacob', 'Logan','Keanu Reeves' ,'Sebastian', 'Danny DeVito','Owen', 'Theodore', 'Samuel', 'Charlotte', 'Isabella', 'Hannah', 'Zoe', 'Stella', 'Lucy','William', 'Danny DeVito', 'Emma' ,'Silvester Stallone', 'Emma' ];
        this.logs = '';
        this.thief = {};
        this.shoppers = [];
        this.isStarted = false;
        this.showAlertWindow = false;
        this.personIndex = 0;
        this.shopperList = '',
        this.zones = [
          { name: 'Entrance', index: 0, neighbors: [1, 2], shopperCounter: 0 },
          { name: 'Food', index: 1, neighbors: [0, 2, 3], shopperCounter: 0, items: [ { name: 'Pizza', price: 2 }, { name: 'Chicken', price: 4 } , { name: 'Bread', price: 3} ] },
          { name: 'Clothes', index: 2, neighbors: [0, 1, 4], shopperCounter: 0, items: [ { name: 'Jacket', price: 30 }, { name: 'Shirt', price: 10 }, { name: 'Shoes', price: 20 } ] },
          { name: 'Gardening', index: 3, neighbors: [1, 4], shopperCounter: 0, items: [ { name: 'Shovel', price: 15 }, { name: 'Flowers', price: 3 }, { name: 'Hose', price: 5 } ] },
          { name: 'Electronics', index: 4, neighbors: [2, 3], shopperCounter: 0, items: [ { name: 'Headphones', price: 50 }, { name: 'Laptop', price: 999 }, { name: 'Smnartphone', price: 499 }] }]
      }
    },
    created() {
      clearInterval();
      setInterval(() => this.doRandomStuff(), 1000);
    },
    computed: {
      startText() {
        return this.isStarted ? 'Stop' : 'Start';
      },
      personCount() {
        return this.shoppers.length;
      },
      isMaskRequired() {
        return this.personCount >= this.maskLimit;
      },
      isDoorLocked() {
        return this.personCount >= this.storeLimit;
      }
    },
    watch: {
      maskLimit(newValue) {
        if (newValue > this.storeLimit) {
          this.maskLimit = this.storeLimit;
        }
      },
      storeLimit(newValue) {
        if (newValue < this.maskLimit) {
          this.storeLimit = this.maskLimit;
        }
      }
    }
}
</script>

<style lang="scss" scoped>
.main-screen {
  .start-button {
    border: 2px solid black;
    background: #f1f1f1;
    padding: 10px;
    border-radius: 20px;
  }
  .started:hover {
    background: red;
  }
  .stopped:hover {
    background: green;
  }
  .logs {
    white-space: break-spaces;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .log-table {
      height: 400px;
      background: white;
      border: 2px solid black;
      border-radius: 10px;
      line-height: 25px;
      width: 400px;
      overflow: scroll;
    }
  }
  .shopperList {
    white-space: break-spaces;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .shopper-list {
      height: 100px;
      background: white;
      border-radius: 10px;
      border: 2px solid black;
      width: 200px;
      overflow: scroll;
}
}
  .mask {
    width: 150px;
    opacity: 0.5;
  }
  .isActive {
    opacity: 1;
  }
  .title-bar {
    display: flex;
  }
}
.mask {
  grid-area: mask;
}
.title {
  grid-area: title;
}
.door {
  grid-area: door;
}
.grid-container {
  display: grid;
  grid-template-areas: 
  'mask title title door';
  grid-gap: 10px;
  padding: 10px;
}
.map-entrance {
  grid-area: entrance;
}
.map-zone-1 {
  grid-area: one;
}
.map-zone-2 {
  grid-area: two;
}
.map-zone-3 {
  grid-area: three;
}
.map-zone-4 {
  grid-area: four;
}
.map-wrapper {
  border-radius: 30px;
  display: grid;
  flex: 1;
  grid-gap: 10px;
  grid-template-areas:
  'entrance one three'
  'entrance two four';
  padding: 16px;
  background-color: #f35921;
  margin-right: 16px;
}
.content-wrapper {
  display: flex;
  padding: 32px;
}
.zone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgb(203, 243, 255);
  border: 2px solid black; 
}
.zone-text {
  background: #d8d8d8;
  padding: 5px;
  border-radius: 20px;
}
.image {
  width: 100px;
}
.input {
  padding: 8px;
  border-radius: 20px;
}
.reset-button {
  padding: 8px;
  margin-left: 10px;
  border-radius: 20px;
  cursor: pointer;
}
.reset-button:hover {
  background: #f1f1f1;
}
.label-divider {
  margin-top: 16px;
}
</style>
