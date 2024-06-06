export function decrementAdults(tenant_information: tenant_information) {
    if (tenant_information.adults > 1) {
        tenant_information.adults--;
        return tenant_information;
    }
}

export function incrementAdults(tenant_information: tenant_information) {
    tenant_information.adults++;
    return tenant_information;
}

export function decrementChildren(tenant_information: tenant_information) {
    if (tenant_information.children > 0) {
        tenant_information.children--;
        return tenant_information;
    }
}

export function incrementChildren(tenant_information: tenant_information) {
    tenant_information.children++;
    return tenant_information;
}

export function decrementPets(tenant_information: tenant_information) {
    if (tenant_information.pets > 0) {
        tenant_information.pets--;
        return tenant_information;
    }
}

export function incrementPets(tenant_information: tenant_information) {
    tenant_information.pets++;
    return tenant_information;
}