<template>
  <div></div>
</template>

<script>
export default {
    name: 'CheckoutSensor',
    data() {
        return {
        };
    },
    methods: {
        checkout(shopper) {
            this.$emit('checkedOut',shopper)
        },
    },
    created() {
        this.eventBus.on('checkout-event', this.checkout);
    }
}
</script>

<style>

</style>