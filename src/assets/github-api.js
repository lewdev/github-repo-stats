//https://stackoverflow.com/a/66938952/1675237
const GithubApi = (() => {
  // const crypt = (salt, text) => {
  //   const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  //   const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  //   const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
  //   return text
  //     .split("")
  //     .map(textToChars)
  //     .map(applySaltToChar)
  //     .map(byteHex)
  //     .join("");
  // };
  //
  const decrypt = (salt, encoded) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    return encoded
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
  };

  let username = null;
  const tokenStr = "434c547b48764210731c566b60567e7e426b5d5c4a655c68465267686a71136c74671749161d7670";
  const salt = "f2q23";
  const TOKEN = decrypt(salt, tokenStr);
  const API_URL = "https://api.github.com";

  const get = path => fetch(`${API_URL}${path}`,{headers: {Authorization: `token ${TOKEN}`}})
    .then(r => r.json())
    .then(r => {if (r.message) alert(r.message); return r;})
    .catch(error => err.innerHTML = error)
  ;

  const doPromise = method => new Promise(resolve => method().then(resolve));
  const handleCb = (data, cb) => {
    if (cb) cb(data);
    return data;
  };
  return {
    getUser: cb => get("/user").then(data => {
      username = data.login;
      return handleCb(data, cb);
    }),
    getGists: cb => get(`/users/${username}/gists`)
      .then(data => (
        data.map(d => {
          const { url, files, description } = d;
          return {
              url, description, files: Object.keys(files).map(key => {
              const { filename, raw_url } = files[key];
              return { filename, raw_url, public: d.public };
            })
          };
        })
      ))
      .then(data => handleCb(data, cb))
    ,
    getRepos: cb => get(`/user/repos`)
      .then(data => (
        data.map(d => {
          const { id, name, description, html_url, created_at, updated_at, stargazers_count, watchers, forks } = d;
          return { id, name, description, html_url, private: d.private, created_at, updated_at, stargazers_count, watchers, forks };
        })
      ))
      .then(data => handleCb(data, cb))
    ,
    // const getRepo = repoName => get(`/repos/${username}/${repo}`).then(data => handleCb(data, cb)),
    getTraffic: repoName => get(`/repos/${username}/${repoName}/traffic/views`),
    getClones: repoName => get(`/repos/${username}/${repoName}/traffic/clones`),
    getReferrers: repoName => get(`/repos/${username}/${repoName}/traffic/popular/referrers`),
    getAllRepoStats: repo => {
      if (!repo) return;
      const { name } = repo;
      const { getTraffic, applyStats, getClones, getReferrers } = GithubApi;
      return getTraffic(name).then(trafficData => {
        applyStats(repo, "views", trafficData, "timestamp");
      })
      .then(() => getClones(name).then(clonesData => {
        applyStats(repo, "clones", clonesData, "timestamp");
      }))
      .then(() => getReferrers(name).then(referrersData => {
        applyStats(repo, "referrers", referrersData, "referrer");
        return referrersData;
      }));
    },
    applyStats: (repo, attr, data, baseAttr) => {
      const isReferrers = attr === "referrers";
      const dayArr = (isReferrers ? data : data[attr]) || [];
      if (!repo[attr]) repo[attr] = dayArr;
      else {
        //merge: find and replace or add
        for (const row of dayArr) {
          const found = repo[attr].find(v => v[baseAttr] === row[baseAttr]);
          if (found) {
            if (!isReferrers) {
              row.count += found.count;
              row.uniques += found.uniques;
            }
            repo[attr] = repo[attr].map(v => v[baseAttr] === row[baseAttr] ? row : v);
          }
          else repo[attr].push(row);
        }
      }
      return repo; 
    }
  };
})();