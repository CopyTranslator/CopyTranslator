CopyTranslator

|image0| |image1| |PyPI version| |image3| |Say Thanks!| 

Copy, Translate, and Paste with Google translate API

Get started
-----------

Environment
~~~~~~~~~~~

-  Python 2.7 or Python 3 and higher ### Requirements **Only windows can
   automatically install ``wxpython`` using ``pip``, in other OS you
   need to install ``wxpython`` manually.** #### Windows

-  pip

In windows, pip can help install all the install requirements. ####
Unbuntu or other Linux release with GUI - pip - wxpython - xclip

In linux, ``wxpython`` can't be installed using pip, and we need
``xclip`` to help ``pyperclip`` work.

Here are the example to install the requirements

.. code:: shell

    sudo apt-get install python-wxtools 
    sudo apt-get install xclip

For more information, refer to the installation of ``wxpython`` and
``pyperclip``

OS X
^^^^

-  wxpython
-  pip

In OS X, ``wxpython`` can't be installed using pip.

Please refer to the installation of ``wxpython``.

One possible way is to install ``wxpython`` in OS X using ``homebrew``

.. code:: shell

    brew install wxpython

Setup
~~~~~

Install this Application using ``pip``:

.. code:: shell

    pip install CopyTranslator

Example usage
-------------

Run shell command

.. code:: shell

    CopyTranslator

**For Windows users**, you can use command below instead to free
yourself from console.

.. code:: cmd

    CopyTranslator_win

Screenshots
-----------

Windows 10
~~~~~~~~~~

.. figure:: ./screenshot/screenshot.png
   :alt: win10.png

   win10.png
.. figure:: .\screenshot\screenshot2.png
   :alt: 1527275165973

   1527275165973
Unbuntu
~~~~~~~

.. figure:: ./screenshot/screenshot-unbuntu.png
   :alt: screenshot-unbuntu.png

   screenshot-unbuntu.png
Acknowledgements
----------------

Thanks to the developers of `wxpython <https://wxpython.org/>`__,
`googletrans <https://github.com/ssut/py-googletrans>`__,
`pyperclip <https://github.com/asweigart/pyperclip>`__ and my dear
schoolmates.

License
-------

The code is licensed under Mozilla Public License 2.0. For more details,
read the `LICENSE <./LICENSE>`__ file.

.. |image0| image:: https://img.shields.io/badge/language-python-blue.svg
.. |image1| image:: https://img.shields.io/badge/license-MPL2.0-000000.svg
.. |PyPI version| image:: https://badge.fury.io/py/CopyTranslator.svg
   :target: https://badge.fury.io/py/CopyTranslator
.. |image3| image:: https://img.shields.io/badge/platform-linux|windows|osx-lightgrey.svg
.. |Say Thanks!| image:: https://img.shields.io/badge/Say%20Thanks-!-1EAEDB.svg
   :target: https://saythanks.io/to/agentzheng
