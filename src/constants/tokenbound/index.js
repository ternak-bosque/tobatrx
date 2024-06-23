import { IMPLEMENTATION_ABI } from "./accountAbi";
import { REGISTRY_ABI } from "./registryAbi";

export const TOKENBOUND = {
    "mainnet": {
        registryAbi: REGISTRY_ABI,
        registryAddress: "",
        accountImplementationAbi: IMPLEMENTATION_ABI,
        accountImplementationAddress: "",
        salt: "0x0000000000000000000000000000000000000000000000000000000000000000"
    },
    "shasta": {
        registryAbi: REGISTRY_ABI,
        registryAddress: "THQZDiuUFSwZoMc3CB2USM22tfmDcEruk1",
        accountImplementationAbi: IMPLEMENTATION_ABI,
        accountImplementationAddress: "TE7PpzWXYGAcKqv1TjMD5kVEoJVk3xe6Dy",
        salt: "0x0000000000000000000000000000000000000000000000000000000000000000"
    },
    "nile": {
        registryAbi: REGISTRY_ABI,
        registryAddress: "TE4xFtwAikSNhVpk7DcDXzooEBhy2eXE3i",
        accountImplementationAbi: IMPLEMENTATION_ABI,
        accountImplementationAddress: "TYUBDqFuVxcxEJAYhC7FwwTrtffijWq6vh",
        salt: "0x1000000000000000000000000000000000000000000000000000000000000000"
    }
}