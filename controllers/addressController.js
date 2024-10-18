const Users = require('../models/User');
const Category = require("../models/Category");
const Address = require('../models/address');

const getAddress = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});

        let userAddress = await Address.findOne({ userId });


        const addresses = userAddress ? userAddress.address : [];
        return res.render('user/address-book', { user, categories, addresses });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const getAddAddress = async (req, res) => {
    try {
        const oldValue = req.session.oldValue || {};
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});
        req.session.oldValue = null;
        return res.render('user/add-address', { user, categories, oldValue });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const addAddress = async (req, res) => {
    try {
        const { addressType, city, state, street, apartment, country, postalCode, phone, landMark, name } = req.body;
        const userId = req.session.user_id;
        console.log(addressType, city, state, street, apartment, country, postalCode, phone, landMark)

        if (!name || !street || !apartment || !country || !state || !city || !postalCode || !phone) {
            const oldValues = { name, street, apartment, country, state, city, postalCode, phone, landMark }
            req.session.oldValue = oldValues;
            req.flash('error_msg', 'All Fields are required Check Again !!!');
            return res.redirect('/profile/add-address');
        }

        if (postalCode.length < 6) {
            const oldValues = { name, street, apartment, country, state, city, postalCode, phone, landMark }
            req.session.oldValue = oldValues;
            req.flash('error_msg', 'Enter Valid PostalCode !!!');
            return res.redirect('/profile/add-address');
        }

        if (phone.length < 10 || phone.length > 10) {
            const oldValues = { name, street, apartment, country, state, city, postalCode, phone, landMark }
            req.session.oldValue = oldValues;
            req.flash('error_msg', 'Enter Valid Phone Number !!!');
            return res.redirect('/profile/add-address');
        }

        let addressRecord = await Address.findOne({ userId });

        const newAddress = {
            streetAddress: street,
            addressType,
            name,
            city,
            state,
            landMark,
            apartment,
            country,
            postalCode,
            phone
        }

        if (!addressRecord) {
            addressRecord = new Address({
                userId,
                address: [newAddress]
            })
        } else {
            addressRecord.address.push(newAddress);
        }

        await addressRecord.save();
        return res.redirect('/address');
    } catch (error) {
        console.log(error);
    }
}


const addAddressFromCheckout = async (req, res) => {
    try {
        const { addressType, city, state, street, apartment, country, postalCode, phone, landMark, name } = req.body;
        const userId = req.session.user_id;
        console.log(addressType, city, state, street, apartment, country, postalCode, phone, landMark)

        if (!name || !street || !apartment || !country || !state || !city || !postalCode || !phone) {
            const oldValues = { name, street, apartment, country, state, city, postalCode, phone, landMark }
            req.session.oldValue = oldValues;
            req.flash('error_msg', 'All Fields are required Check Again !!!');
            return res.redirect('/cart/check-out');
        }

        if (postalCode.length < 6) {
            const oldValues = { name, street, apartment, country, state, city, postalCode, phone, landMark }
            req.session.oldValue = oldValues;
            req.flash('error_msg', 'Enter Valid PostalCode !!!');
            return res.redirect('/cart/check-out');
        }

        if (phone.length < 10 || phone.length > 10) {
            const oldValues = { name, street, apartment, country, state, city, postalCode, phone, landMark }
            req.session.oldValue = oldValues;
            req.flash('error_msg', 'Enter Valid Phone Number !!!');
            return res.redirect('/cart/check-out');
        }


        let addressRecord = await Address.findOne({ userId });

        const newAddress = {
            streetAddress: street,
            addressType,
            name,
            city,
            state,
            landMark,
            apartment,
            country,
            postalCode,
            phone
        }

        if (!addressRecord) {
            addressRecord = new Address({
                userId,
                address: [newAddress]
            })
        } else {
            addressRecord.address.push(newAddress);
        }

        await addressRecord.save();
        return res.redirect('/cart/check-out');
    } catch (error) {
        console.log(error);
    }
}

const getEditAddress = async (req, res) => {
    try {
        const oldValue = req.session.oldValue || {};
        req.session.oldValue = null;
        const userId = req.session.user_id;
        const addressId = req.params.id;
        const user = await Users.findById(userId);
        const categories = await Category.find({});
        const addressRecord = await Address.findOne({ userId });
        const address = addressRecord.address.id(addressId);
        let address_id = address._id.toString();
        return res.render('user/edit-address', {
            user,
            categories,
            address,
            address_id,
            oldValue
        })
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error of get Edit Address');
    }
};


const editAddress = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const addressId = req.params.id;
        const { addressType, city, state, street, apartment, country, postalCode, phone, landMark, name } = req.body;


        if (!name || !street || !apartment || !country || !state || !city || !postalCode || !phone) {
            const oldValues = { name, street, apartment, country, state, city, postalCode, phone, landMark }
            req.session.oldValue = oldValues;
            req.flash('error_msg', 'All Fields are required Check Again !!!');
            return res.redirect('/profile/add-address');
        }

        if (postalCode.length < 6) {
            const oldValues = { name, street, apartment, country, state, city, postalCode, phone, landMark }
            req.session.oldValue = oldValues;
            req.flash('error_msg', 'Enter Valid PostalCode !!!');
            return res.redirect('/profile/add-address');
        }

        if (phone.length < 10 || phone.length > 10) {
            const oldValues = { name, street, apartment, country, state, city, postalCode, phone, landMark }
            req.session.oldValue = oldValues;
            req.flash('error_msg', 'Enter Valid Phone Number !!!');
            return res.redirect('/profile/add-address');
        }

        const addressRecord = await Address.findOne({ userId });
        if (!addressRecord) {
            return res.status(404).send('Address not found');
        }

        const address = addressRecord.address.id(addressId);

        if (!address) {
            return res.status(404).send('Address not found');
        }

        address.streetAddress = street;
        address.addressType = addressType;
        address.city = city;
        address.name = name;
        address.state = state;
        address.landMark = landMark;
        address.apartment = apartment;
        address.country = country;
        address.postalCode = postalCode;
        address.phone = phone;

        await addressRecord.save();

        req.flash('success_msg', '')
        res.redirect('/address');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error in edit Address');
    }
};



const deleteAddress = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const addressId = req.params.id;

        const result = await Address.updateOne(
            { userId: userId },
            { $pull: { address: { _id: addressId } } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.redirect('/address');
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'An error occurred while deleting the address' });
    }
};

module.exports = {
    getAddress,
    addAddress,
    editAddress,
    getAddAddress,
    getEditAddress,
    deleteAddress,
    addAddressFromCheckout
}