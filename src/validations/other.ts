export const otherValidations = {
    swear: (text: string) => {
        /* BAD WORDS
            - k*rwa/y 
            - k*tas
            - j*b*ć
            - j*eban*
            - p**rd*l
            - p*enis
            - dz*wka
            - c*pa
            - ch*j / h*j
            - c*ck
            - s*x / s*ks
            - h**ker
            - b**bs
            - t*ts
            - slut
            - kys
            - cunt
            - retard
            - braindead
        */
        const regex = /k[0ou]+rw[ay]|k[u0o]+t[a4]+s|j[e3]+b[a4]+?ć|j[e3]+ban[yao]+|p[i1]+[e3]+rd[ao0]+l|p[e3]+n[i1]+s|dz[i1]+wk[a4]+|c[i1]+pa|ch[u0o]+j|h[o0u]+j|c[o0]+ck|s[e3]+x|s[e3]+ks|h[o0]+ker|b[0o]+bs|t[1i]+ts|slut|kys|cunt|r[3e]tard|braind[3e]+ad/gi
        const isValid = regex.test(text)

        return isValid
    }
}