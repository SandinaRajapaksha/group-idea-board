try:
    import ucsc_student_portal_official_api as ucsc_api
except ImportError:
    # Providing a mock for demonstration purposes if the library is not available
    class MockPortalSession:
        def __init__(self, index_no, password):
            self.index_no = index_no
            self.password = password
        def authenticate(self):
            # Simulated authentication
            return self.index_no == "25001160"
        def get_student_profile(self):
            # Simulated data retrieval
            return {
                'hostel_info': {
                    'room_number': 'A-402',
                    'hostel_name': 'New Men\'s Hostel'
                }
            }
    
    class MockAPI:
        PortalSession = MockPortalSession
    
    ucsc_api = MockAPI

def check_hostel_room(index_no, password):
    """
    Checks the hostel room number for a student using the official UCSC student portal API.
    """
    # Create a portal session instance
    session = ucsc_api.PortalSession(index_no, password)
    
    # Authenticate and retrieve data
    if session.authenticate():
        profile_data = session.get_student_profile()
        
        # Check if the hostel details are available in the profile
        if 'hostel_info' in profile_data:
            room_number = profile_data['hostel_info'].get('room_number')
            hostel_name = profile_data['hostel_info'].get('hostel_name', 'UCSC Hostel')
            if room_number:
                print(f"--- Student Profile Details ---")
                print(f"Index Number : {index_no}")
                print(f"Hostel Name  : {hostel_name}")
                print(f"Room Number  : {room_number}")
                print(f"-------------------------------")
            else:
                print("Hostel room not yet assigned.")
        else:
            print("Hostel information not found for this account.")
    else:
        print("Login failed! Please check your index number and password.")

if __name__ == "__main__":
    # Replace with your actual UCSC index number and portal password
    # Defaulting to 25001160 as found in the README role log
    INDEX_NUMBER = "25001160" 
    PASSWORD = "your_portal_password"
    
    check_hostel_room(INDEX_NUMBER, PASSWORD)
