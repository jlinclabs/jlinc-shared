# JLINC Shared

A place to store things shared by:

- jlinclabs/Staging-A
- jlinclabs/Staging-B
- jlinclabs/jlinc-webapp




```bash
docker run  -v $(pwd):/app --
docker run -p 3000:3000 -v $(pwd):/app --
podman run -it -v $(pwd):/app --userns=keep-id IMAGE_ID -- bash
```