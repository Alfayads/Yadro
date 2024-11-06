const Users = require('../models/User');
const Category = require("../models/Category");
const Address = require('../models/address');
const Announcement = require('../models/announcement')

const getAddress = async (req, res, next) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});
        const announcements = await Announcement.find({});
        let userAddress = await Address.findOne({ userId });


        const addresses = userAddress ? userAddress.address : [];
        return res.render('user/address-book', { user, categories, addresses, announcements });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
        next();
    }
}

const getAddAddress = async (req, res, next) => {
    try {
        const oldValue = req.session.oldValue || {};
        const userId = req.session.user_id;
        const announcements = await Announcement.find({});
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});
        req.session.oldValue = null;
        return res.render('user/add-address', { user, categories, oldValue, announcements });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
        next()
    }
}

const addAddress = async (req, res, next) => {
    try {
        const { addressType, city, street, apartment, postalCode, phone, landMark, name } = req.body;
        const userId = req.session.user_id;
        console.log(addressType, city, street, apartment, postalCode, phone, landMark)

        if (!name || !street || !apartment || !city || !postalCode || !phone) {
            const oldValues = { name, street, apartment, city, postalCode, phone, landMark }
            req.session.oldValue = oldValues;
            req.flash('error_msg', 'All Fields are required Check Again !!!');
            return res.redirect('/profile/add-address');
        }

        if (postalCode.length < 6) {
            const oldValues = { name, street, apartment, city, postalCode, phone, landMark }
            req.session.oldValue = oldValues;
            req.flash('error_msg', 'Enter Valid PostalCode !!!');
            return res.redirect('/profile/add-address');
        }

        if (phone.length < 10 || phone.length > 10) {
            const oldValues = { name, street, apartment, city, postalCode, phone, landMark }
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
            landMark,
            apartment,
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
        const err = new Error('Sever Error Please try Again ' + error);
        err.statusCode = 500
        next(err)
    }
}


const addAddressFromCheckout = async (req, res, next) => {
    try {
        const { addressType, city, street, apartment, postalCode, phone, landMark, name } = req.body;
        const userId = req.session.user_id;
        console.log(addressType, city, street, apartment, postalCode, phone, landMark)

        if (!name || !street || !apartment || !city || !postalCode || !phone) {
            const oldValues = { name, street, apartment, city, postalCode, phone, landMark }
            req.session.oldValue = oldValues;
            req.flash('error_msg', 'All Fields are required Check Again !!!');
            return res.redirect('/cart/check-out');
        }

        if (postalCode.length < 6) {
            const oldValues = { name, street, apartment, city, postalCode, phone, landMark }
            req.session.oldValue = oldValues;
            req.flash('error_msg', 'Enter Valid PostalCode !!!');
            return res.redirect('/cart/check-out');
        }

        if (phone.length < 10 || phone.length > 10) {
            const oldValues = { name, street, apartment, city, postalCode, phone, landMark }
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
            landMark,
            apartment,
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
        const err = new Error('Sever Error Please try Again');
        err.statusCode = 500
        next(err)
    }
}

const getEditAddress = async (req, res, next) => {
    try {
        const oldValue = req.session.oldValue || {};
        req.session.oldValue = null;
        const userId = req.session.user_id;
        const addressId = req.params.id;
        const user = await Users.findById(userId);
        const categories = await Category.find({});
        const addressRecord = await Address.findOne({ userId });
        const address = addressRecord.address.id(addressId);
        const announcements = await Announcement.find({});
        let address_id = address._id.toString();
        return res.render('user/edit-address', {
            user,
            categories,
            address,
            address_id,
            oldValue,
            announcements
        })
    } catch (error) {
        console.error(error);
        const err = new Error('Server Error of get Edit Address');
        err.statusCode = 500
        next(err)
    }
};


const editAddress = async (req, res, next) => {
    try {
        const userId = req.session.user_id;
        const addressId = req.params.id;
        const { addressType, city, street, apartment, postalCode, phone, landMark, name } = req.body;


        if (!name || !street || !apartment || !city || !postalCode || !phone) {
            const oldValues = { name, street, apartment, city, postalCode, phone, landMark }
            req.session.oldValue = oldValues;
            req.flash('error_msg', 'All Fields are required Check Again !!!');
            return res.redirect('/profile/add-address');
        }

        if (postalCode.length < 6) {
            const oldValues = { name, street, apartment, city, postalCode, phone, landMark }
            req.session.oldValue = oldValues;
            req.flash('error_msg', 'Enter Valid PostalCode !!!');
            return res.redirect('/profile/add-address');
        }

        if (phone.length < 10 || phone.length > 10) {
            const oldValues = { name, street, apartment, city, postalCode, phone, landMark }
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
        address.landMark = landMark;
        address.apartment = apartment;
        address.postalCode = postalCode;
        address.phone = phone;

        await addressRecord.save();

        req.flash('success_msg', '')
        res.redirect('/address');
    } catch (error) {
        console.error(error);
        const err = new Error('Server Error in edit Address');
        err.statusCode = 404;
        next(err)
    }
};



const deleteAddress = async (req, res, next) => {
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
        const err = new Error('Error Occured while deleting the Address Try again');
        err.statusCode = 404;
        next(err)
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