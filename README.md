# Arcalink Sync

Arcalink Sync synchronizes notes and folders between Obsidian vaults through the Arcalink service. It supports manual and automatic synchronization, shared vaults and folders, conflict handling, and account-based access across devices.

## Requirements

- An Arcalink account is required.
- The plugin connects to an Arcalink server over the network to authenticate the user and synchronize vault data.
- Some service plans and collaboration features may require payment. Current service terms and available plans are published at [arcalink.ru](https://arcalink.ru).

## Network and data use

The plugin sends account, device, vault, synchronization, and note data to the Arcalink server configured in the plugin settings. This network access is required to synchronize content between devices and provide shared-vault features.

The plugin does not include client-side analytics or telemetry. Operational data handled by the Arcalink service is subject to the service's published privacy policy and terms.

## Installation

After the plugin is accepted into the Obsidian Community directory:

1. Open **Settings → Community plugins** in Obsidian.
2. Select **Browse** and search for **Arcalink Sync**.
3. Install and enable the plugin.
4. Open the plugin settings, enter the Arcalink server URL, and sign in.

## Development

Install dependencies and create a production build:

```bash
npm ci
npm run build
```

The production build generates `main.js`. Develop and test the plugin only in a separate test vault.

## Support

For product information and support, visit [arcalink.ru](https://arcalink.ru).

## License

Copyright (C) 2026 ИП Санкин Денис Николаевич.

Arcalink Sync is licensed under the [GNU General Public License version 3 only](./LICENSE) (`GPL-3.0-only`). Anyone distributing a modified version must provide the corresponding source under the same license.

This license applies to the plugin code in this repository. It does not grant rights to the Arcalink trademarks, hosted service, or separately maintained server software. Third-party components and their notices are listed in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
