// log the pageview with their URL
export const pageview = (url) => {
    let hostname = window.location.hostname;
    if(hostname.indexOf('localhost') > -1 ||
        hostname.indexOf('127.0.0.1') > -1 ){
        return;
    }
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      page_path: url,
    })
}
  
// log specific events happening.
export const event = ({ action, params }) => {
  let hostname = window.location.hostname;
    if(hostname.indexOf('localhost') > -1 ||
        hostname.indexOf('127.0.0.1') > -1 ){
        return;
    }
    window.gtag('event', action, params)
}