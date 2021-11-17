<template>
  <div class="main-screen">
    <div class="grid-container">
      <div class="mask" :class="{ isActive: isMaskRequired  }">
        <img class="mask" src="@/assets/mask.png" />
      </div>
      <div class="title">
        <h1>Sensor Project</h1>
      <div class="start-button" :class="{ started: isStarted, stopped: !isStarted }" @click="isStarted = !isStarted">
        {{ startText }}
      </div>
      </div>
      <div class="door">
        Front door is: {{ isDoorLocked }}
      </div>
    </div>
      <div class="person-counter">
        Number of people: {{ personCount }}
      </div>
      <div class="content-wrapper">
        <div class="map-wrapper">
          <div class="map-entrance zone">Entrance
            <motion-sensor :zoneNumber="0" @shopperMovement="movementDetected" />
          </div>
          <div class="map-zone-1 zone">Food
            <motion-sensor :zoneNumber="1" @shopperMovement="movementDetected" />
          </div>
          <div class="map-zone-2 zone">Clothes
            <motion-sensor :zoneNumber="2" @shopperMovement="movementDetected" />
          </div>
          <div class="map-zone-3 zone">Gardening
            <motion-sensor :zoneNumber="3" @shopperMovement="movementDetected" />
          </div>
          <div class="map-zone-4 zone">Electronics
            <motion-sensor :zoneNumber="4" @shopperMovement="movementDetected" />
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

export default {
    name: 'MainSceen',
    components: {
      MotionSensor,
    },
    data() {
      return {
        names: ['John', 'Rick Astley', 'Andrew', 'Shrek', 'Olivia', 'Ben Shapiro', 'William', 'Danny DeVito', 'Emma' ,'Silvester Stallone', 'Keanu Reeves'],
        logs: '',
        shoppers: [],
        isStarted: false,
        maskLimit: 3,
        soteLimit: 10,
        personIndex: 0,
        zones: [{ name: 'Entrance', index: 0, neighbors: [1, 2] }, { name: 'Food', index: 1, neighbors: [0, 2, 3] }, { name: 'Clothes', index: 2, neighbors: [0, 1, 4] }, { name: 'Gardening Tools', index: 3, neighbors: [1, 4] }, { name: 'Electronics', index: 4, neighbors: [2, 3] }],
      };
    },
    methods: {
      doRandomStuff() {
        if (this.isStarted) {
          if (this.isDoorLocked === 'Open') {
          this.addPerson();
          this.shoppers.forEach( (shopper, index) => {
            this.personAction(shopper, index);
            if (Math.random() > 0.95) {
            this.removePerson(shopper);
          }
          })
        }
        }
      },
      addPerson() {
        if (Math.random() > 0.5) {
          let index = Math.floor(Math.random() * (this.names.length - 1));
          let name = this.names[index];
          this.names.splice(index, 1);
          this.shoppers.push({ name, location: this.zones[0], cart: [], isFinished: false });
          this.personIndex += 1;
          this.logs = `${this.logs}\n${name} entered the shop.`;
        }
      },
      removePerson(shopper) {
        this.names.push(shopper.name);
        this.shoppers.pop(shopper);
        this.logs = `${this.logs}\n${shopper.name} left the store.`;
        this.scrollToBottom();
      },
      personAction(shopper, shopperIndex) {
        console.log('SHOPPER', shopper, 'INDEX', shopperIndex); 
        // buy item
        if (Math.random() > 0.7 && shopper.location.index !== 0) {
          let item = `${shopper.location.name} - item`
          this.shoppers[shopperIndex].cart.push(item);
          console.log('BUY');
          this.eventBus.emit(`purchaseEvent-${shopper.location}`, { shopper, item });
        }
        // movement
        let newLocation = Math.floor(Math.random() * (shopper.location.neighbors.length))
        this.shoppers[shopperIndex].location = this.zones[newLocation];
        this.eventBus.emit(`movement-zone-${newLocation}`, shopper )
      },
      movementDetected(params) {
        console.log(params);
        this.logs = `${this.logs}\n${params.person} moved to the ${this.zones[params.location].name} aisle.`;
        this.scrollToBottom();
      },
      purchaseDetected(params) {
        this.logs = `${this.logs}\n${params.person} bought a/an ${this.zones[params.zoneIndex].name} - item`;
        this.scrollToBottom();
      },
      scrollToBottom() {
        let div = this.$refs.logging;
        div.scrollTop = div.scrollHeight;
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
        return this.personCount >= this.storeLimit ? 'Locked' : 'Open';
      }
    }
}
</script>

<style lang="scss" scoped>
.main-screen {
  .start-button {
    border: 2px solid black;
    background: "#1F1F1F";
  }
  .started:hover {
    background: red;
  }
  .stopped:hover {
    background: green;
  }
  .logs {
    margin-top: 32px;
    white-space: break-spaces;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .log-table {
      height: 400px;
      border: 2px solid black;
      width: 200px;
      overflow: scroll;
}
  }
  .mask {
    width: 100px;
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
  display: grid;
  flex: 1;
  grid-gap: 10px;
  grid-template-areas:
  'entrance one three'
  'entrance two four';
  padding: 16px;
  background-color: #2196F3;
  margin-right: 16px;
}
.content-wrapper {
  display: flex;
  padding: 32px;
}
.zone {
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border: 2px solid black; 
}
</style>
