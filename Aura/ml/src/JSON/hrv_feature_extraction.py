import argparse
import json
import time
import serial


BAUD_RATE = 115200
SAMPLE_RATE = 250

OUTPUT_FILE = "ecg_data.json"


def main():

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--port",
        required=True
    )

    parser.add_argument(
        "--baud",
        type=int,
        default=BAUD_RATE
    )

    args = parser.parse_args()

    try:

        ser = serial.Serial(
            args.port,
            args.baud,
            timeout=1
        )

    except serial.SerialException as e:

        print("Could not open serial port.")
        print(e)
        print()
        print("Make sure Arduino Serial Monitor is CLOSED.")

        return


    print()
    print("====================================")
    print(" ECG JSON LOGGER")
    print("====================================")
    print(f"Port       : {args.port}")
    print(f"Baud       : {args.baud}")
    print(f"Sample rate: {SAMPLE_RATE} Hz")
    print()
    print("Collecting ECG data...")
    print("Press Ctrl+C to stop.")
    print()


    samples = []

    sample_number = 0

    start_time = time.time()


    try:

        while True:

            line = ser.readline().decode(
                "utf-8",
                errors="ignore"
            ).strip()


            if not line:
                continue


            if line.startswith("ECG:"):

                try:

                    ecg_value = int(
                        line.split(
                            ":",
                            1
                        )[1]
                    )

                except ValueError:

                    continue


                timestamp = (
                    sample_number /
                    SAMPLE_RATE
                )


                samples.append({

                    "sample": sample_number,

                    "time_seconds": round(
                        timestamp,
                        4
                    ),

                    "ECG": ecg_value

                })


                sample_number += 1


                # Show progress every 250 samples
                if sample_number % 250 == 0:

                    elapsed = (
                        time.time() -
                        start_time
                    )

                    print(
                        f"Samples: {sample_number} "
                        f"| Time: {elapsed:.1f}s "
                        f"| ECG: {ecg_value}"
                    )


    except KeyboardInterrupt:

        print()
        print("Stopping ECG collection...")


    finally:

        ser.close()


    # ============================================
    # SAVE JSON
    # ============================================

    duration = (
        sample_number /
        SAMPLE_RATE
        if sample_number > 0
        else 0
    )


    output = {

        "sample_rate_hz": SAMPLE_RATE,

        "total_samples": sample_number,

        "duration_seconds": round(
            duration,
            2
        ),

        "created": time.strftime(
            "%Y-%m-%d %H:%M:%S"
        ),

        "data": samples

    }


    with open(
        OUTPUT_FILE,
        "w"
    ) as f:

        json.dump(
            output,
            f,
            indent=2
        )


    print()
    print("====================================")
    print(" ECG DATA SAVED")
    print("====================================")
    print()
    print(f"File: {OUTPUT_FILE}")
    print(f"Samples: {sample_number}")
    print(f"Duration: {duration:.2f} seconds")
    print()
    print(
        "Location: "
        f"{OUTPUT_FILE}"
    )


if __name__ == "__main__":
    main()