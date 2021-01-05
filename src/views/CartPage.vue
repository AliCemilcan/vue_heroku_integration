<template>
  <products-list 
  :cartItems="cartItems" 
  :totalPrice="totalPrice"
  v-on:remove-from-cart="removeFromCart($event)"/>
</template>

<script>
import axios from 'axios';
import ProductsList from '../components/ProductsList.vue';

export default {
    name:'CartPage',
    components:{
        ProductsList
    },
    data(){
        return{
            cartItems:[],
            totalPrice: 0 
        }
    },
    methods:{
        async removeFromCart(productId){
            // delete returns cartItems so we just use it
            const result = await axios.delete(`/api/users/12345/cart/${productId}`);
            this.cartItems = result.data;
        }
    },
    computed:{

    },
    async created(){
        const result = await axios.get('/api/users/12345/cart');
        setTimeout(()=>{
          console.log("set time out")
        },2000);
        const cartItems = result.data;
        this.cartItems = cartItems
        this.totalPrice = this.cartItems.reduce(
                (sum, item)=> sum + Number(item.price),
                0,
            )
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

  .product-container {
    align-content: 'center';
    border-bottom: 1px solid #ddd;
    display: flex;
    padding: 16px;
    width: 100%;
  }

  .product-image {
    flex: 1;
    height: 100px;
    max-width: 100px;
  }

  .details-wrap {
    padding: 0 16px;
    flex: 3;
  }

  .remove-button {
    flex: 1;
    margin: auto;
  }
</style>