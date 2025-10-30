# Core

![dsdsds](https://github.com/datarhei/misc/blob/main/img/media-core.png?raw=true)

[![License: Apache2](https://img.shields.io/badge/License-Apache%202.0-brightgreen.svg)](<[https://opensource.org/licenses/MI](https://www.apache.org/licenses/LICENSE-2.0)>)
[![CodeQL](https://github.com/datarhei/core/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/datarhei/core/actions/workflows/codeql-analysis.yml)
[![tests](https://github.com/datarhei/core/actions/workflows/go-tests.yml/badge.svg)](https://github.com/datarhei/core/actions/workflows/go-tests.yml)
[![codecov](https://codecov.io/gh/datarhei/core/branch/main/graph/badge.svg?token=90YMPZRAFK)](https://codecov.io/gh/datarhei/core)
[![Go Report Card](https://goreportcard.com/badge/github.com/datarhei/core)](https://goreportcard.com/report/github.com/datarhei/core)
[![PkgGoDev](https://pkg.go.dev/badge/github.com/datarhei/core)](https://pkg.go.dev/github.com/datarhei/core)
[![Gitbook](https://img.shields.io/badge/GitBook-quick%20start-green)](https://docs.datarhei.com/core/guides/beginner)

The datarhei Core is a process management solution for FFmpeg that offers a range of interfaces for media content, including HTTP, RTMP, SRT, and storage options. It is optimized for use in virtual environments such as Docker. It has been implemented in various contexts, from small-scale applications like Restreamer to large-scale, multi-instance frameworks spanning multiple locations, such as dedicated servers, cloud instances, and single-board computers. The datarhei Core stands out from traditional media servers by emphasizing FFmpeg and its capabilities rather than focusing on media conversion.

## Objectives of development

The objectives of development are:

-   Unhindered use of FFmpeg processes
-   Portability of FFmpeg, including management across development and production environments
-   Scalability of FFmpeg-based applications through the ability to offload processes to additional instances
-   Streamlining of media product development by focusing on features and design.

## What issues have been resolved thus far?

### Process management

-   Run multiple processes via API
-   Unrestricted FFmpeg commands in process configuration.
-   Error detection and recovery (e.g., FFmpeg stalls, dumps)
-   Referencing for process chaining (pipelines)
-   Placeholders for storage, RTMP, and SRT usage (automatic credentials management and URL resolution)
-   Logs (access to current stdout/stderr)
-   Log history (configurable log history, e.g., for error analysis)
-   Resource limitation (max. CPU and MEMORY usage per process)
-   Statistics (like FFmpeg progress per input and output, CPU and MEMORY, state, uptime)
-   Input verification (like FFprobe)
-   Metadata (option to store additional information like a title)

### Media delivery

-   Configurable file systems (in-memory, disk-mount, S3)
-   HTTP/S, RTMP/S, and SRT services, including Let's Encrypt
-   Bandwidth and session limiting for HLS/MPEG DASH sessions (protects restreams from congestion)
-   Viewer session API and logging

### Misc

-   HTTP REST and GraphQL API
-   Swagger documentation
-   Metrics incl. Prometheus support (also detects POSIX and cgroups resources)
-   Docker images for fast setup of development environments up to the integration of cloud resources

