export default function shakeProof(fn,delay){
    let timer = null
    return function(){
        if(timer){
            clearInterval(timer)
        }
        timer = setTimeout(fn,delay)
    }
}