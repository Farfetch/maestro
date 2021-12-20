import socket

from maestro_agent.settings import AGENT_HOST


class HostService:
    @staticmethod
    def get_private_ip():
        "Returns machine private IP address"
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            # doesn't even have to be reachable
            s.connect(("10.255.255.255", 1))
            ip = s.getsockname()[0]
        except Exception:
            # Safety check. Jmeter still will not be able to connect by using 127.0.0.1
            ip = "127.0.0.1"
        finally:
            s.close()
        return ip

    @staticmethod
    def current_host():
        "Returns dictionary with IP and hostname with ability to use custom ones"
        if AGENT_HOST:
            return dict(ip="127.0.0.1", hostname=AGENT_HOST)

        hostname = socket.gethostname()
        ip = HostService.get_private_ip()

        return dict(ip=ip, hostname=hostname)
