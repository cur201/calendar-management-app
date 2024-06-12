import MediaQuery from 'react-responsive'


export const Desktop = ({children}) =>{
    return <MediaQuery minWidth={'768px'}>{children}</MediaQuery>
}


export const Mobile = ({children}) =>{
    return <MediaQuery maxWidth={'768px'}>{children}</MediaQuery>
}
