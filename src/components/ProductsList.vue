<template>
<div>
    <div id ="page-wrap"
     v-if="cartItems.length>0">
            <h1>Shopping Cart</h1>
    <products-list-item 
    v-for="product in cartItems"
           :key="product.id"
          
           v-on:remove-from-cart="$emit('remove-from-cart', $event)"
           :product="product"
        class="product-container" />
        <h3 id="total-price">Total: ${{ totalPrice }}</h3>
        <button id="checkout-button">Proceed to checkout</button>
    </div>
    <div>
        <h3> Your cart is empty </h3>
    </div>
</div>
</template>

<script>
import ProductsListItem from './ProductsListItem.vue';

export default {
    name:'ProductList',
    props:['cartItems', 'totalPrice'],
    components:{
        ProductsListItem
    }
}
</script>

<style scoped>
  h1 {
    border-bottom: 1px solid black;
    margin: 0;
    margin-top: 16px;
    padding: 16px;
  }

  #total-price {
    padding: 16px;
    text-align: right;
  }

  #checkout-button {
    width: 100%;
  }
  #checkout-button:active{
    width: 100%;
    background-color: green;
  }

  .product-container {
    align-content: 'center';
    border-bottom: 1px solid #ddd;
    display: flex;
    padding: 16px;
    width: 100%;
  }


  .details-wrap {
    padding: 0 16px;
    flex: 3;
  }

 
</style>