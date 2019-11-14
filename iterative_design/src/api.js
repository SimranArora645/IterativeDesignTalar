import localStorage from 'local-storage'
import * as Constants from './constants'
export function generateGetQuery(url, params) {
    const queryString = Object.keys(params).map(key => [key, '=', params[key]].join("")).join("&")
    return [url, "?", queryString].join("")
}
export async function requireAuthentication(callback, shouldRedirect = true) {
    const params = { authToken: localStorage('authToken') }
    fetch(generateGetQuery("/api/validate-token", params)).then(async res => {
        if (res.status !== 200 && shouldRedirect) {
            window.location.href = "/"
        } else {
            const body = await res.json()
            console.log(body)
            callback(body)
        }
    })
}

export async function getPlans(callback) {
    fetch(generateGetQuery("/api/pricing-plans", {})).then(async res => {
        const body = await res.json()
        callback(body.plans)
    })
}

export async function getAllGroceryItems(callback) {
    fetch(generateGetQuery("/api/all-grocery-items", {})).then(async res => {
        const body = await res.json()
        callback(body.groceryItems)
    })
}

export async function getUserSettings(email, callback) {
    fetch(generateGetQuery("/api/user-settings", { [Constants.EMAIL_PROPERTY]: email })).then(async res => {
        const body = await res.json()
        callback(body.userSettings)
    })
}

export async function getGroceryCart(email, callback) {
    fetch(generateGetQuery("/api/my-cart", { [Constants.EMAIL_PROPERTY]: email })).then(async res => {
        const body = await res.json()
        callback(body.groceryCart)
    })
}