export function formatDateFromDateTime(dateParam) {
    const date = new Date(dateParam)
    const dateFormatted = date.getDate().toString().padStart(2, "0") + '/' +
                        (date.getMonth() + 1).toString().padStart(2, "0") + '/' +
                        date.getFullYear() 
    return dateFormatted
} 
