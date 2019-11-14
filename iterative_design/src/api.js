import localStorage from 'local-storage'

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