<template>
    <div id="page-wrap" v-if="product">
        <div id="img-wrap">
            <img v-bind:src="product.imageUrl"/>
        </div>
        <div id="product-details">
            <h1>{{product.name}}</h1>
            <h3 id="price">${{product.price}}</h3>
            <p>Average Rating: {{ product.averageRating}}</p>
            <button 
            id="add-to-cart"
            v-bind:class="{ active: itemIsInCart}"
            v-on:click="addToCart"
            >{{buttonText}}</button>
            <h4>Description</h4>
            <p>{{product.description}}</p>

        </div>
    </div>
    <NotFoundPage v-else/>
</template>

<script>
import axios from 'axios';
import NotFoundPage from './NotFoundPage.vue'
export default {
    name:'ProductDetail',
    components:{
        NotFoundPage
    },
    data(){
        return{
            product: {},
            showSuccessMessage: false,
            userCarts:[],
            buttonText: "Add To Cart",
            itemIsInCart:false

        }
    },
    computed:{
        // itemIsInCart(){
        //     console.log("hello", this.product)
        //     return true
        //     // return this.userCarts.some(item => item.id === this.product.id)
        // }
    },
    methods:{
        async addToCart(){
            await axios.post('/api/users/12345/cart', {productId: this.$route.params.id});
          
            this.showSuccessMessage = true;
            this.buttonText = "Item Successfully Added!"
            //wait 1 second
            setTimeout(()=>{
                this.$router.push('/products');
            }, 1500);
        }
    },
    async created(){
        const result = await axios.get(`/api/products/${this.$route.params.id}`)
        console.log(this.$route.params.id);
        // when I assign like this. it automatically gets data
        const {data: result2} = await axios.get('/api/users/12345/cart');
        this.userCarts = result2
        const product = result.data;
        console.log(product)
        this.product = product;
        if(this.userCarts.some(item => item.id === this.product.id)){
          this.itemIsInCart = true
        }
        if(this.itemIsInCart){
                this.buttonText = "Add Item Again"
        }

    }
    
}
</script>

<style scoped>
  #page-wrap {
    margin-top: 16px;
    padding: 16px;
    max-width: 600px;
  }

  #img-wrap {
    text-align: center;
  }

  img {
    width: 400px;
  }

  #product-details {
    padding: 16px;
    position: relative;
  }

  #add-to-cart {
    width: 100%;
  }
  #add-to-cart:active{
    width: 100%;
    background-color: green;
  }

  #price {
    position: absolute;
    top: 24px;
    right: 16px;
  }
  .active{
      background-color: grey;
  }

</style>
