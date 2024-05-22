export {};

declare global {
    interface booking_range {
        start: string,
        end: string
    }

    interface rental {
        id: number;
        price: number;
        coordinates_id?: string | number;
        location_id?: string | number;
        type_id?: string | number;
        type_booking_id?: string | number;
        content_id: number;
        conveniences_ids: number[];
        comments_ids: number[];
        status: number;
    }

    interface rentals_coordinates {
        id: number;
        latitude: string;
        longitude: string;
        rental_id: number;
    }

    interface location {
        id?: number;
        rentals_id?: number;
        full_address: string;
        city: string;
        country: string;
        index: string;
        rental_number: string;
    }

    interface rental_comments {
        id: number;
        user_created: string;
        status: string;
        rental_id: number;
        overall_impression: number;
        location: number;
        date_created: string;
        communication: number;
        cleanliness: number;
        arrival: number;
        accuracy: number;
        text: string;
        created_at: string;
    }

    interface conveniences_of_rentals {
        id: number;
        name: string;
        icon: string;
    }

    interface content_of_rental_files {
        id: number;
        content_of_rental_id: number;
        directus_files_id: string;

    }

    interface content_of_rental {
        id?: number;
        rental_id?: number;
        number_of_bathrooms: number;
        number_of_bedrooms: number;
        number_of_beds: number;
        number_of_max_guests: number;
        title: string;
        description: string;
    }

    interface type_of_rental {
        id: number;
        icon: string;
        name: string;
    }

    interface type_of_booking {
        id: number;
        icon: string;
        name: string;
        description: string;
    }

    interface status {
        id: number;
        name: string;
        name_translate: string;
    }
    interface directus_files{
        id: string;
        tags: string[];
    }
    interface messages{
        id: number;
        user_created: string;
        date_created: string;
        dialog_of_messages_id: number;
        content: string;
    }
}
