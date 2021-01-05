<template>
    <div class="grid-wrap">
        <products-grid-item
        v-for="product in products"
        :key="product.id"
        :product="product" />

    </div>
</template>

<script>
import ProductsGridItem from './ProductsGridItem';
export default {
    name: 'ProductsGrid',
    props:['products'],
    components:{
        ProductsGridItem
    }
}

</script>
<style scoped>
.product-item {
    align-items: center;
    border-radius: 8px;
    box-shadow: 0px 2px 5px #888;
    display: flex;
    flex-direction: column;
    margin-bottom: 2%;
    padding: 20px;
    position: relative;
    width: 32%;
}

.grid-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    margin-top: 16px;
}
</style>