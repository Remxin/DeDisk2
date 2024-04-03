import {ReadonlyURLSearchParams} from "next/navigation"
import { NextRouter } from "next/router"


export  function createQueryString(searchParams: ReadonlyURLSearchParams, name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value+"%2F")
    return ""
    // return params.toString()
  }

  export function updateQuery(router: NextRouter, name: string, value: string) {
    console.log(value)
      router.query[name] = value
    //   console.log(router.query)
    router.push(router)
  }