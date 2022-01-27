import csv
from io import BytesIO, StringIO


class CsvBytesIO:
    def create_from_dict(headers, data):
        proxy = StringIO()

        writer = csv.DictWriter(proxy, fieldnames=headers)

        writer.writeheader()

        for row in data:
            writer.writerow(row)

        # Creating the byteIO object from the StringIO Object
        bytes_obj = BytesIO()
        bytes_obj.write(proxy.getvalue().encode())
        # seeking was necessary. Python 3.5.2, Flask 0.12.2
        bytes_obj.seek(0)
        proxy.close()

        return bytes_obj
