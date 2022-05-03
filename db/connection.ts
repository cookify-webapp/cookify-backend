import uniqueValidator from 'mongoose-unique-validator';
import mongooseAutoPopulate from 'mongoose-autopopulate';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoose from 'mongoose';

//---------------------
//   CONNECTION
//---------------------
mongoose.connect(process.env.MONGODB_URL || '');

//---------------------
//   PLUGINS
//---------------------
mongoose.plugin(uniqueValidator, { message: 'Expected {PATH} to be unique' });
mongoose.plugin(mongooseAutoPopulate, { functions: ['find', 'findOne', 'findOneAndUpdate'] });
mongoose.plugin(mongoosePaginate);
mongoose.plugin(aggregatePaginate);
