
<style scoped>
.cardFooter{
  display: flex;
  justify-content: flex-end
}

</style>
<template>
  <div>
    
    <button @click="modalShow = !modalShow" class="btn btn-warning"  style="color:#ffffff; margin-left:10px">Editar</button>
    
    <b-modal title="Edite o Evento" v-model="modalShow" class="modal fade" hide-footer>
      <div>
        <form>
          <div class="form-group">
            <label>Nome</label>
            <input type="text" v-model="form.name" class="form-control"  placeholder="Nome">
          </div>
          <div class="form-group">
            <label>Local</label>
            <input type="text" v-model="form.local" class="form-control" placeholder="Local">
          </div>
          <div class="cardFooter">
            <button @click="handlerUpdate" class="btn btn-success">Salvar</button>
          </div>
      </form>
      </div>
    </b-modal> 
  </div>
</template>

<script>
import api from "@/services/api";

  export default {
    props:{
      idEvent:''
    },
    data(){
        return{
          modalShow:false,
          form:{
            
          },
         
        }
    },
    mounted() {
      this.getUsers();
    },
    methods:{
      async getUsers(){
        
        const response = await api.get("/event",{
          headers:{
            Authorization:localStorage.getItem("token_event"),
            id:this.$props.idEvent
          }
        });
        
        this.$data.form = response.data.event;
      },

      async handlerUpdate(){
        const response = await api.put("/event",this.$data.form,{
          headers:{
            Authorization:localStorage.getItem("token_event"),
            id:this.$props.idEvent
          }
        });
        console.log(response)
        this.$data.modalShow = false;
        window.location.reload(true);
      }
    }
  }
</script>

  