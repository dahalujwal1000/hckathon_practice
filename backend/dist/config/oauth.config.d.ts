declare const _default: (() => {
    google: {
        clientId: string | undefined;
        clientSecret: string | undefined;
        callbackUrl: string | undefined;
    };
    github: {
        clientId: string | undefined;
        clientSecret: string | undefined;
        callbackUrl: string | undefined;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    google: {
        clientId: string | undefined;
        clientSecret: string | undefined;
        callbackUrl: string | undefined;
    };
    github: {
        clientId: string | undefined;
        clientSecret: string | undefined;
        callbackUrl: string | undefined;
    };
}>;
export default _default;
