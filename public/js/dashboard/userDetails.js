(async () => {
    console.log(location.href);
    const res = await fetch(location.href);
    console.log(res);
    const data = await res.locals;
    console.log(data);
})();