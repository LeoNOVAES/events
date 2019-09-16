const Event = require("../models/EventsModel");
const moment = require("moment");

module.exports = {
    async store(req,res){
        try{
           const data = req.body;
           
           const today = moment();
           if(today > moment(data.datetime)) return res.status(403).json({message:"Data invalida!"}); 

           const exists = await Event.find({ name:data.name });
           if(exists.length > 0) return res.status(409).json({ message:"Evento ja existe!" });
          
           const event = await Event.create(data);
           return res.status(200).json({ event, link:`/guests/${event._id}` });

        }catch(e){
            console.log(e);
            return res.status(400).json({message:"Erro Inesperado!"});
        }
    },

    async listGuests(req,res){

        const { id } = req.headers;
        const { guests } = await Event.findById(id);
        return res.status(200).json({ guests });
    },

    async acceptInvite(req,res){
        const { guest } = req.headers;
        const { events } = req.headers;

        let today = moment();

        const event = await Event.findById(events);
        if(event.guests.includes(guest)){
            return res.status(409).json({ message:"Voce ja esta convidado para esse evento!" });
        }

        if(today > moment(event.datetime)) return res.status(403).json({ message:"evento ja realizado!" });
        
        if(event.guests.length == event.limit) return res.status(403).json({ message:`O evento atingiu seu limite maximo` });    
        
        event.guests.push(guest);
        event.save();
        return res.status(200).json({ message:`O evento começara dia ${event.datetime}` });
    },

    async index(req,res){
        const { id } = req.headers;
        const event = await Event.findById(id);
        return res.status(200).json({ event });
    },

    async indexAll(req,res){
        const events = await Event.find();
        return res.status(200).json({ events });
    },

    async update(req,res){
        const { id } = req.headers;
        const event = await Event.update({_id:id}, req.body);
        return res.json({ event });
    },

    async delete(req,res){
        try{
            const { id , user } = req.headers;
            const event = await Event.findById(id);
            
            if(event.organizer != user) return res.status(403).json({ message:"Não autorizado!" });

            await Event.findOneAndRemove({ _id:id});
            return res.status(200).json({message:"Evento deletado com sucesso"});
        }catch(e){
            console.log(e)
            return res.status(400).json("erro inesperado");
        }
    }
}