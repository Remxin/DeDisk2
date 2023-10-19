// variants
export const menuVariants = {
    shrunk: {
        width: 80
    },

    extended: {
        width: 200
    }
}

export const arrowVariants = {
    normal: {
        rotate: 0,
        transition: {
            duration: .2
        }
    },

    rotate: {
        rotate: 180,
        transition: {
            duration: .2
        }
    }
}

export const optionsListVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: .1
        }
    }
}

export const optionVariants = {
    initial: {
        opacity: 0,
        left: -10
    },
    animate: {
        opacity: 1,
        left: 0
    }
}

export const buttonVariants = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1,
        transition: {
            delay: .5
        }
    }
}