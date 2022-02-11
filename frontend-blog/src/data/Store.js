import React, { useReducer } from "react";
import { initialState, reducer } from '../store/Reducer'

export const AppContext = React.createContext(initialState)

const Store = props => {
    const [state, dispatch] = useReducer(reducer, initialState)

    function showModal(childrenParam, modalJustifyContentParam) {
        dispatch({type: 'show_modal', payload: {children: childrenParam, modalJustifyContent: modalJustifyContentParam}})
    }

    function showMessage(messageType='info', messageText) {
        dispatch({type: 'show_message', payload: {messageType, messageText}})
        setTimeout(() => {
            dispatch({type: 'hide_message'})
        }, 2000)
    }

    function updateLoggedUser(payload) {
        dispatch({type: 'update_user', payload})
    }

    function setToolBarContent (payload) {
        dispatch({type: 'set_toolbar_content', payload})
    }

    function setFooterContent (payload) {
        dispatch({type: 'set_footer_content', payload})
    }

    return (
        <AppContext.Provider value= {{
                modalVisible: state.modalVisible, 
                children: state.children,
                modalJustifyContent: state.modalJustifyContent,
                closeModal: () => dispatch({type: 'reset'}),
                showModal: (childrenParam, modalJustifyContentParam) => showModal(childrenParam, modalJustifyContentParam || 'none'), 
                messageVisible: state.messageVisible, 
                messageType: state.messageType, 
                messageText: state.messageText,
                showMessage: (messageType, messageText) => showMessage(messageType, messageText), 
                user: state.user,
                profileLoggedUser: state.profileLoggedUser,
                updateLoggedUser: payload => {updateLoggedUser(payload)}, 
                toolBarContent: state.toolBarContent, 
                setToolBarContent: payload => setToolBarContent(payload),
                footerContent: state.footerContent, 
                setFooterContent: payload => setFooterContent(payload)
            }} >
            {props.children}
        </AppContext.Provider>
        
    )
}

export default Store