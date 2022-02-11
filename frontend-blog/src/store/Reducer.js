export  const initialState = {
    modalVisible: 'hidden', 
    children: '', 
    modalJustifyContent: 'none', 
    messageVisible: false, 
    messageText: '', 
    messageType: 'info', 
    user: {
        name: '', 
        email: '',
        token: '', 
        validToken: false, 
        isAdministrator: false
    }, 
    profileLoggedUser: {
        id: null,
        name: null,
        email: null, 
        photo: null,
        bioDescription: null,
        allowEmailNotification: null,
        frequencyEmailNotification: null,
        firstAccess: null,
        lastAccess: null
    }, 
    toolBarContent: null,
    footerContent: null
}

const storageKey = 'blog_token_key'

export function reducer (state, action) {
    switch (action.type) {
        case 'reset': 
            return ({
                    ...initialState, user: state.user, 
                    profileLoggedUser: state.profileLoggedUser, 
                    toolBarContent: state.toolBarContent,
                    footerContent: state.footerContent
                })
        case 'show_modal': 
            return ({
                    ...state, 
                    modalVisible: 'visible', 
                    children: action.payload.children, 
                    modalJustifyContent: action.payload.modalJustifyContent
                })
        case 'show_message': 
            return ({
                ...state, 
                messageVisible: true,
                messageType: action.payload.messageType,
                messageText: action.payload.messageText 
            })
        case 'hide_message': 
            return ({
                ...state, 
                messageVisible: false,
                messageType: 'info',
                messageText: '' 
            })
        case 'update_user':
            if (action.payload.validToken) {
                localStorage.setItem(storageKey, action.payload.token)
            } else {
                localStorage.removeItem(storageKey)
            }
            const userAux = {}
            userAux.name = action.payload.userProfile.name || ''
            userAux.email = action.payload.userProfile.email || ''
            userAux.token = action.payload.token || ''
            userAux.validToken = action.payload.validToken || false
            userAux.isAdministrator = action.payload.userProfile.isAdministrator || false
            return({
                ...state, 
                user: userAux, 
                profileLoggedUser: action.payload.userProfile
            })
        case 'set_toolbar_content': 
            return({
                ...state, 
                toolBarContent: action.payload
            })

        case 'set_footer_content': 
            return({
                ...state, 
                footerContent: action.payload
            })
        
        default: 
            return state
    }
}