const mongooes = require('mongoose');

const bookingSchema = new mongooes.Schema({
    tour:{
        type:mongooes.Schema.ObjectId,
        ref:'Tour',
        required:[true,'Booking must belongs to Tour!']
    },
    user:{
        type:mongooes.Schema.ObjectId,
        ref:'User',
        required:[true,'Booking must belongs to User!']
    },
    price:{
        type:Number,
        require:[true,'Booking must have price']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    paid:{
        type: Boolean,
        default: true
    }
});

bookingSchema.pre(/^find/,function(next){
    this.populate('user').populate({
        path:'tour',
        select: 'name'
    });
    next();
});

const Booking = mongooes.model('Booking',bookingSchema);

module.exports = Booking;

