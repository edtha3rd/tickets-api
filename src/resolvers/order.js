module.exports = {
     //a ticket is for a single movie
   toWatch: async(order, args, { models }) => {
        return await models.Movie.findById( order.toWatch._id )
   },
   //at a single location
   location: async(order, args, { models }) => {
        return await models.User.findById(order.location._id)
   },
   //by a single user
   orderedBy: async(order, args, { models }) => {
     return await models.User.findById( order.orderedBy._id )
   }
}