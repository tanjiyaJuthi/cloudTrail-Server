let collections = {};

export const initCollections = (db) => {
    collections = {
        destinationCollection: db.collection("destinations"),
        profileCollection: db.collection("user"),
        testimonialCollection: db.collection("testimonials"),
        bookingCollection: db.collection("bookings"),
    };
};

export const getCollections = () => collections;