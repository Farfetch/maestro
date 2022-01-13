from maestro_agent.services.running_test.files import RunningTestFiles


class TestRunningTestFiles:
    def test_create_directories(self, mocker):
        run_id = "1-2-3"
        running_test_files = RunningTestFiles(run_id)

        makedirs_mock = mocker.patch("os.makedirs")

        running_test_files.create_directories()

        assert 2 == makedirs_mock.call_count
        assert (running_test_files.custom_data_dir,) == makedirs_mock.call_args_list[
            0
        ].args
        assert {"exist_ok": True} == makedirs_mock.call_args_list[0].kwargs
        assert {"exist_ok": True} == makedirs_mock.call_args_list[1].kwargs
        assert (running_test_files.mount_dir,) == makedirs_mock.call_args_list[1].args

    def test_clean_up_files(self, mocker):
        run_id = "1-2-3"
        running_test_files = RunningTestFiles(run_id)
        running_test_files.mount_dir = "/test-mnt-dir"
        files = ["file1", "file2"]
        mocker.patch("os.listdir", return_value=files)
        os_remove_mock = mocker.patch("os.remove")

        running_test_files.clean_up_files()

        assert 2 == os_remove_mock.call_count
        assert ("/test-mnt-dir/file1",) == os_remove_mock.call_args_list[0].args
        assert ("/test-mnt-dir/file2",) == os_remove_mock.call_args_list[1].args
