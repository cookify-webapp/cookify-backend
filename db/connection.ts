import uniqueValidator from 'mongoose-unique-validator';
import mongooseAutoPopulate from 'mongoose-autopopulate';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URL as string);

mongoose.plugin(uniqueValidator);
mongoose.plugin(mongooseAutoPopulate, {
  functions: ['find', 'findOne', 'findOneAndUpdate', 'aggregate'],
});
mongoose.plugin(mongoosePaginate);
mongoose.plugin(aggregatePaginate);