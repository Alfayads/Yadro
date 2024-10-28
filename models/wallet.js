const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['credit', 'debit', 'Refund'], // specify 'credit' for adding funds, 'debit' for spending
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    time: {
        type: Date,
    },
    description: {
        type: String,
        default: ''
    }
});

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    transactions: [transactionSchema],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});


walletSchema.pre('save', function (next) {
    this.lastUpdated = Date.now();
    next();
});

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;