<template>
  <div></div>
</template>

<script>
export default {
    name: 'MotionSensor',
    props: {
        zoneNumber: Number,
    },
    data() {
        return {
        };
    },
    methods: {
        addItemToCart(purchase) {
            console.log('PURCHASE', purchase);
        },
        shopperMovement(shopper) {
            this.$emit('shopperMovement', { person: shopper.name, location: this.zoneNumber });
        }
    },
    created() {
        this.eventBus.on(`cartEvent-${this.zoneNumber}`, this.addItemToCart);
        this.eventBus.on(`movement-zone-${this.zoneNumber}`, this.shopperMovement);
        this.eventBus.on(`puchaseEvent-${this.zoneNumber}`, this.addItemToCart);
    }
}
</script>

<style lang="scss" scoped>
</style>