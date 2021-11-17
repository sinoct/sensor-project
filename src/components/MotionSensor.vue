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
            console.log('item', purchase.item)
            this.$emit('cartEvent', { ...purchase })
        },
        shopperMovement(shopper) {
            this.$emit('shopperMovement', { person: shopper.name, location: this.zoneNumber });
        }
    },
    created() {
        this.eventBus.on(`movement-zone-${this.zoneNumber}`, this.shopperMovement);
        this.eventBus.on(`purchaseEvent-${this.zoneNumber}`, this.addItemToCart);
    }
}
</script>

<style lang="scss" scoped>
</style>