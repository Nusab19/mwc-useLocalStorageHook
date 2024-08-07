* This is a question for stackoverflow

# "useLocalStorage" is a client only hook

I'm using `useLocalStorage` hook from `@uidotdev/usehooks`. Even though [HomePage.tsx](src/components/HomePage.tsx) file is set to "use client", I'm getting the following error:
```bash
 ⨯ Error: useLocalStorage is a client-only hook
    at HomePage (./src/components/HomePage.tsx:15:98)
digest: "1786536127"
 GET / 500 in 180ms
```

Even though the docs state that the hooks are "server-safe", I keep getting this error.
